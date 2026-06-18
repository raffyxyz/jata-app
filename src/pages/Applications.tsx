import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  statusColors,
  statusLabels,
} from "../data/mock";
import type { ApplicationStatus, Page, JobApplication } from "../types";
import { getApplications, deleteApplication } from "../db";

const statusFilters: (ApplicationStatus | "all")[] = [
  "all",
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

interface ApplicationsProps {
  onNavigate: (page: Page) => void;
}

export function Applications({ onNavigate }: ApplicationsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  const handleDelete = async (id: string) => {
    await deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">
            Track and manage all your job applications.
          </p>
        </div>
        <button className="btn-primary" onClick={() => onNavigate("new-application")}>
          <Plus size={16} strokeWidth={2.5} />
          New Application
        </button>
      </div>

      <div className="applications-toolbar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search companies or positions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="filter-button">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="status-tabs">
        {statusFilters.map((status) => (
          <button
            key={status}
            className={`status-tab ${statusFilter === status ? "active" : ""}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === "all"
              ? "All"
              : statusLabels[status]}
            {status !== "all" && (
              <span
                className="status-tab-dot"
                style={{ backgroundColor: statusColors[status] }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  No applications found
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="table-company">
                      <div className="company-avatar small">
                        {app.company.charAt(0)}
                      </div>
                      <span className="table-company-name">
                        {app.company}
                      </span>
                    </div>
                  </td>
                  <td className="table-position">{app.position}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: statusColors[app.status] + "18",
                        color: statusColors[app.status],
                      }}
                    >
                      {statusLabels[app.status]}
                    </span>
                  </td>
                  <td className="table-date">
                    {app.appliedDate || "—"}
                  </td>
                  <td className="table-location">{app.location}</td>
                  <td className="table-action-cell">
                    <div className="action-menu">
                      <button
                        className="table-action"
                        onClick={() =>
                          setOpenMenu(openMenu === app.id ? null : app.id)
                        }
                      >
                        <MoreVertical size={14} />
                      </button>
                      {openMenu === app.id && (
                        <div className="action-dropdown">
                          <button
                            className="action-dropdown-item"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            className="action-dropdown-item"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <div className="action-dropdown-divider" />
                          <button
                            className="action-dropdown-item danger"
                            onClick={() => {
                              setOpenMenu(null);
                              setDeleteConfirm(app.id);
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Application</h3>
            <p className="modal-desc">
              Are you sure you want to delete this application? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
