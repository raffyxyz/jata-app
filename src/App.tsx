import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Applications } from "./pages/Applications";
import { Resume } from "./pages/Resume";
import { Documents } from "./pages/Documents";
import { Settings } from "./pages/Settings";
import type { Page } from "./types";

function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "applications":
        return <Applications />;
      case "resume":
        return <Resume />;
      case "documents":
        return <Documents />;
      case "settings":
        return <Settings />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
