import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import Home from "./pages/Home";

// Configure base path for GitHub Pages
const base = "/client_calculator";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={base}>
      <Toaster />
      <Router />
    </WouterRouter>
  );
}

export default App;

