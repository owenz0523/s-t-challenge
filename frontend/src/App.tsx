import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";

export type ViewMode = "front-of-house" | "back-of-house";

export default function App() {
  const [viewMode, setViewMode] =
    useState<ViewMode>("front-of-house");

  return (
    <div className="min-h-screen bg-background">
      <Dashboard
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
}