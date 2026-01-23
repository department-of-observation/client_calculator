"use client";

import Home from "@/components/pages/Home";

export default function NotFoundPage() {
  // Since I removed NotFound.tsx (it was mostly a placeholder), I'll redirect to Home or show a simple 404
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <a href="/" className="mt-6 text-blue-500 hover:underline">Go back home</a>
    </div>
  );
}
