import {
  LayoutDashboard,
  Briefcase,
  FileText,
  FolderOpen,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import type { Page } from "../types";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
  { id: "applications", label: "Applications", icon: <Briefcase size={18} strokeWidth={1.5} /> },
  { id: "resume", label: "Resume", icon: <FileText size={18} strokeWidth={1.5} /> },
  { id: "documents", label: "Documents", icon: <FolderOpen size={18} strokeWidth={1.5} /> },
];

export function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Briefcase size={16} strokeWidth={2.5} />
          </div>
          {!collapsed && <span className="sidebar-title">jata</span>}
        </div>
        {!collapsed && <span className="sidebar-subtitle">Job Tracker</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        <div className="sidebar-nav-spacer" />

        <button
          className={`sidebar-nav-item ${activePage === "settings" ? "active" : ""}`}
          onClick={() => onNavigate("settings")}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={18} strokeWidth={1.5} />
          {!collapsed && <span>Settings</span>}
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">AC</div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Alex Chen</span>
              <span className="sidebar-user-email">alex@email.com</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft size={16} strokeWidth={1.5} />
          ) : (
            <PanelLeftClose size={16} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </aside>
  );
}
