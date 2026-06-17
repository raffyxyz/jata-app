import {
  Briefcase,
  CalendarCheck,
  TrendingUp,
  XCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  mockStats,
  mockApplications,
  statusColors,
  statusLabels,
} from "../data/mock";

export function Dashboard() {
  const recentApps = mockApplications
    .filter((a) => a.appliedDate)
    .sort(
      (a, b) =>
        new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    )
    .slice(0, 5);

  const interviews = mockApplications.filter((a) => a.status === "interview");

  const statusCounts = mockApplications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statCards = [
    {
      label: "Total Applications",
      value: mockStats.totalApplications,
      icon: <Briefcase size={20} />,
      color: "#78716C",
    },
    {
      label: "Active",
      value: mockStats.activeApplications,
      icon: <TrendingUp size={20} />,
      color: "#D97706",
    },
    {
      label: "Interviews",
      value: mockStats.interviews,
      icon: <CalendarCheck size={20} />,
      color: "#22C55E",
    },
    {
      label: "Offers",
      value: mockStats.offers,
      icon: <TrendingUp size={20} />,
      color: "#22C55E",
    },
    {
      label: "Rejected",
      value: mockStats.rejected,
      icon: <XCircle size={20} />,
      color: "#DC2626",
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, Alex. Here's your job search overview.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Applications</h2>
            <button className="section-action">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="recent-list">
            {recentApps.map((app) => (
              <div key={app.id} className="recent-item">
                <div className="recent-item-left">
                  <div className="company-avatar">
                    {app.company.charAt(0)}
                  </div>
                  <div className="recent-item-info">
                    <span className="recent-item-position">
                      {app.position}
                    </span>
                    <span className="recent-item-company">
                      {app.company}
                    </span>
                  </div>
                </div>
                <div className="recent-item-right">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: statusColors[app.status] + "18",
                      color: statusColors[app.status],
                    }}
                  >
                    {statusLabels[app.status]}
                  </span>
                  <span className="recent-item-date">{app.appliedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Interviews</h2>
          </div>
          {interviews.length > 0 ? (
            <div className="interview-list">
              {interviews.map((app) => (
                <div key={app.id} className="interview-card">
                  <div className="interview-card-top">
                    <div className="company-avatar">
                      {app.company.charAt(0)}
                    </div>
                    <div className="interview-card-info">
                      <span className="interview-card-position">
                        {app.position}
                      </span>
                      <span className="interview-card-company">
                        {app.company}
                      </span>
                    </div>
                    <ExternalLink size={16} className="interview-card-link" />
                  </div>
                  <div className="interview-card-meta">
                    <span className="interview-card-date">
                      Applied: {app.appliedDate}
                    </span>
                    {app.salary && (
                      <span className="interview-card-salary">
                        {app.salary}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No upcoming interviews</div>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Status Distribution</h2>
        </div>
        <div className="status-bars">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="status-bar-row">
              <div className="status-bar-label">
                <span
                  className="status-dot"
                  style={{ backgroundColor: statusColors[status] || "#A8A29E" }}
                />
                <span>{statusLabels[status] || status}</span>
              </div>
              <div className="status-bar-track">
                <div
                  className="status-bar-fill"
                  style={{
                    width: `${(count / mockStats.totalApplications) * 100}%`,
                    backgroundColor: statusColors[status] || "#A8A29E",
                  }}
                />
              </div>
              <span className="status-bar-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
