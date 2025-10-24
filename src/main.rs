use askama::Template;
use axum::{
    extract::{Form, State},
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use csv::ReaderBuilder;
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::{collections::HashMap, env, fs::File, path::PathBuf, sync::Arc};

static DEPOSIT_MULTIPLIER: Lazy<f64> = Lazy::new(|| 0.5);

#[derive(Debug, Clone, PartialEq, Eq)]
enum Category {
    Subscription,
    OneShot,
}

#[derive(Debug, Deserialize)]
struct RawItem {
    category: String,
    name: String,
    price: f64,
}

#[derive(Debug, Clone)]
struct Item {
    id: usize,
    category: Category,
    name: String,
    price: f64,
}

#[derive(Clone)]
struct AppState {
    items: Vec<Item>,
}

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate<'a> {
    subs: Vec<RowView>,
    ones: Vec<RowView>,
    totals: Totals,
    deposit_multiplier: f64,
    currency: &'a str,
}

#[derive(Debug, Clone)]
struct RowView {
    id: usize,
    name: String,
    unit_price: f64,
    qty: i64,
    discount_pct: f64,
    full_amount: f64,     // after discount * qty
    deposit_amount: f64,  // for one-shot; 0 for subscriptions
    is_one_shot: bool,
}

#[derive(Debug, Default, Clone)]
struct Totals {
    subs_total: f64,
    ones_deposit_total: f64,
    ones_full_total: f64,
    grand_pay_now: f64,     // subs_total + ones_deposit_total
    grand_full_value: f64,  // subs_total + ones_full_total (info)
}

#[tokio::main]
async fn main() {
    // CSV path: env PRICING_CSV or default data/pricing.csv
    let csv_path = env::var("PRICING_CSV").unwrap_or_else(|_| "data/pricing.csv".to_string());
    let items = load_items(csv_path.into()).expect("failed to load CSV");

    let state = Arc::new(AppState { items });

    let app = Router::new()
        .route("/", get(index).post(calculate))
        .with_state(state);

    println!("→ http://127.0.0.1:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("bind 3000");
    axum::serve(listener, app).await.expect("server");
}

async fn index(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    // Build default rows (qty=0, discount=0) for both sections
    let (subs, ones) = default_rows(&state.items);

    // 👇 THIS must exist before you pass `totals` into IndexTemplate
    let totals = compute_totals(&subs, &ones);

    let tpl = IndexTemplate {
        subs,
        ones,
        totals,
        deposit_multiplier: *DEPOSIT_MULTIPLIER,
        currency: "SGD",
    };

    Html(tpl.render().unwrap())
}

#[derive(Debug, Deserialize)]
struct DynamicForm(HashMap<String, String>);

async fn calculate(
    State(state): State<Arc<AppState>>,
    Form(DynamicForm(map)): Form<DynamicForm>,
) -> impl IntoResponse {
    let mut subs_rows = Vec::new();
    let mut ones_rows = Vec::new();

    for it in &state.items {
        let qty = map
            .get(&format!("qty_{}", it.id))
            .and_then(|s| s.trim().parse::<i64>().ok())
            .unwrap_or(0)
            .max(0);

        let disc = map
            .get(&format!("disc_{}", it.id))
            .and_then(|s| s.trim().parse::<f64>().ok())
            .unwrap_or(0.0)
            .clamp(0.0, 100.0);

        let discount_factor = 1.0 - disc / 100.0;
        let full_amount = it.price * qty as f64 * discount_factor;

        let is_one_shot = matches!(it.category, Category::OneShot);
        let deposit_amount = if is_one_shot {
            full_amount * *DEPOSIT_MULTIPLIER
        } else {
            0.0
        };

        let row = RowView {
            id: it.id,
            name: it.name.clone(),
            unit_price: it.price,
            qty,
            discount_pct: disc,
            full_amount,
            deposit_amount,
            is_one_shot,
        };

        if is_one_shot {
            ones_rows.push(row);
        } else {
            subs_rows.push(row);
        }
    }

    // 👇 Again compute totals before using it
    let totals = compute_totals(&subs_rows, &ones_rows);

    let tpl = IndexTemplate {
        subs: subs_rows,
        ones: ones_rows,
        totals,
        deposit_multiplier: *DEPOSIT_MULTIPLIER,
        currency: "SGD",
    };

    match tpl.render() {
        Ok(html) => Html(html).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

fn default_rows(items: &[Item]) -> (Vec<RowView>, Vec<RowView>) {
    let mut subs = Vec::new();
    let mut ones = Vec::new();

    for it in items {
        let row = RowView {
            id: it.id,
            name: it.name.clone(),
            unit_price: it.price,
            qty: 0,
            discount_pct: 0.0,
            full_amount: 0.0,
            deposit_amount: 0.0,
            is_one_shot: matches!(it.category, Category::OneShot),
        };
        if row.is_one_shot {
            ones.push(row);
        } else {
            subs.push(row);
        }
    }
    (subs, ones)
}

fn compute_totals(subs: &[RowView], ones: &[RowView]) -> Totals {
    let subs_total = subs.iter().map(|r| r.full_amount).sum::<f64>();
    let ones_full_total = ones.iter().map(|r| r.full_amount).sum::<f64>();
    let ones_deposit_total = ones.iter().map(|r| r.deposit_amount).sum::<f64>();

    Totals {
        subs_total,
        ones_deposit_total,
        ones_full_total,
        grand_pay_now: subs_total + ones_deposit_total,
        grand_full_value: subs_total + ones_full_total,
    }
}

fn load_items(path: PathBuf) -> Result<Vec<Item>, String> {
    let f = File::open(&path).map_err(|e| format!("open {:?}: {}", path, e))?;
    let mut rdr = ReaderBuilder::new().has_headers(true).from_reader(f);

    let mut out = Vec::new();
    for (idx, rec) in rdr.deserialize::<RawItem>().enumerate() {
        let raw = rec.map_err(|e| format!("csv row {}: {}", idx + 2, e))?;
        let cat = match raw.category.trim().to_ascii_lowercase().as_str() {
            "subscription" | "sub" | "monthly" => Category::Subscription,
            "one_shot" | "one-shot" | "one time" | "one-time" | "oneoff" | "one_off"
            | "oneoffpackage" | "one-shot package" | "ad-hoc" | "adhoc" | "one-shot services" => {
                Category::OneShot
            }
            other => return Err(format!("unknown category '{}'", other)),
        };
        out.push(Item {
            id: idx,
            category: cat,
            name: raw.name.trim().to_string(),
            price: raw.price,
        });
    }
    Ok(out)
}
