import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import {
  mockApplications,
  statusColors,
  statusLabels,
} from "../data/mock";
import type { ApplicationStatus } from "../types";

const statusFilters: (ApplicationStatus | "all")[] = [
  "all",
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

export function Applications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );

  const filtered = mockApplications.filter((app) => {
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
            {filtered.length === 0 ? (
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
                  <td>
                    <button className="table-action">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
