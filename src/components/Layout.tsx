import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Titlebar } from "./Titlebar";
import { ResizeHandles } from "./ResizeHandles";
import type { Page } from "../types";
import type { ReactNode } from "react";

interface LayoutProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  children: ReactNode;
}

export function Layout({ activePage, onNavigate, children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("jata-sidebar-collapsed");
    return stored === "true";
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("jata-sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="app-container">
      <ResizeHandles />
      <Titlebar />
      <div className="app-layout">
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
