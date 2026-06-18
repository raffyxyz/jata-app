import {
  IconLayoutDashboard,
  IconBriefcase,
  IconFileText,
  IconFolderOpen,
  IconSettings,
  IconArrowBarRight,
  IconArrowBarLeft,
} from "@tabler/icons-react";
import type { Page } from "../types";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <IconLayoutDashboard size={16} /> },
  { id: "applications", label: "Applications", icon: <IconBriefcase size={16} /> },
  { id: "resume", label: "Resume", icon: <IconFileText size={16} /> },
  { id: "documents", label: "Documents", icon: <IconFolderOpen size={16} /> },
];

const settingsItem = { id: "settings" as Page, label: "Settings", icon: <IconSettings size={16} /> };

export function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <IconBriefcase size={14} />
        </div>
        {!collapsed && (
          <div>
            <span className="sidebar-title">jata</span>
            <span className="sidebar-subtitle">Job Tracker</span>
          </div>
        )}
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
        <div style={{ flex: 1 }} />
        <button
          className={`sidebar-nav-item ${activePage === settingsItem.id ? "active" : ""}`}
          onClick={() => onNavigate(settingsItem.id)}
          title={collapsed ? settingsItem.label : undefined}
        >
          {settingsItem.icon}
          {!collapsed && <span>{settingsItem.label}</span>}
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
            <IconArrowBarRight size={14} />
          ) : (
            <IconArrowBarLeft size={14} />
          )}
        </button>
      </div>
    </aside>
  );
}
