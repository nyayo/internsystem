import React, { useEffect, useMemo, useState } from "react";
import "./ReportsPage.css";
import placementApi from "../../services/placementApi";
import {
  formatDate,
  getOrganisationTypeLabel,
  getStatusLabel,
  intakeCohorts,
} from "../../data/dashboardData";
import {
  buildTrendSeries,
  downloadCsv,
  downloadReportPdf,
  normalizeBreakdownRows,
} from "../../utils/reportUtils";

function formatPercent(value) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function ReportTable({ title, rows, emptyMessage, labelHeading = "Category" }) {
  return (
    <section className="report-card">
      <div className="report-card-header">
        <h3>{title}</h3>
      </div>
      <div className="table-container">
        <table className="data-table report-table">
          <thead>
            <tr>
              <th>{labelHeading}</th>
              <th>Count</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-results">
                  <p>{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${title}-${row.label ?? row.value}`}>
                  <td>{row.label ?? row.value}</td>
                  <td>{row.count}</td>
                  <td>{formatPercent(row.percentage ?? 0)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await placementApi.getAdminReportStats();
        if (!cancelled) setReport(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.detail ??
              "Unable to load admin reports right now.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const overviewCards = useMemo(() => {
    const overview = report?.overview ?? {};
    return [
      {
        label: "Total Placements",
        value: overview.totalPlacements ?? 0,
        icon: "folder_open",
        tone: "primary",
      },
      {
        label: "Active",
        value: overview.activePlacements ?? 0,
        icon: "work",
        tone: "success",
      },
      {
        label: "Completed",
        value: overview.completedPlacements ?? 0,
        icon: "verified",
        tone: "secondary",
      },
      {
        label: "Pending Approvals",
        value: overview.pendingApprovals ?? 0,
        icon: "pending_actions",
        tone: "warning",
      },
      {
        label: "Pending Logs",
        value: overview.pendingLogs ?? 0,
        icon: "note_alt",
        tone: "info",
      },
      {
        label: "Pending Evaluations",
        value: overview.pendingEvaluations ?? 0,
        icon: "assignment_turned_in",
        tone: "danger",
      },
    ];
  }, [report]);

  const breakdowns = report?.breakdowns ?? {};
  const workload = report?.workload ?? {};

  const trendRows = useMemo(() => buildTrendSeries(report), [report]);
  const trendPeak = useMemo(
    () =>
      Math.max(
        ...trendRows.map((item) =>
          Math.max(
            Number(item.created ?? 0),
            Number(item.approved ?? 0),
            Number(item.activated ?? 0),
            Number(item.completed ?? 0),
          ),
        ),
        1,
      ),
    [trendRows],
  );
  const statusRows = useMemo(
    () => normalizeBreakdownRows(breakdowns.byStatus ?? []),
    [breakdowns.byStatus],
  );
  const statusChartRows = useMemo(
    () =>
      statusRows.map((item) => ({
        ...item,
        label: getStatusLabel(item.value),
      })),
    [statusRows],
  );
  const cohortRows = useMemo(
    () => normalizeBreakdownRows(breakdowns.byCohort ?? []),
    [breakdowns.byCohort],
  );
  const organisationRows = useMemo(
    () => normalizeBreakdownRows(breakdowns.byOrganisationType ?? []),
    [breakdowns.byOrganisationType],
  );

  const handleDownloadCsv = () => {
    downloadCsv(
      `internship-report-${new Date().toISOString().slice(0, 10)}.csv`,
      report,
    );
  };

  const handleDownloadPdf = async () => {
    await downloadReportPdf(
      `internship-report-${new Date().toISOString().slice(0, 10)}.pdf`,
      report,
    );
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="report-loading">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <div className="report-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Reports</h1>
          <p className="subtitle">
            Track internship performance, workflow, and backlog at a glance.
          </p>
        </div>
        <div className="report-actions">
          <button className="btn-secondary" onClick={handleDownloadCsv}>
            <span className="material-icons-sharp">table_view</span>
            CSV
          </button>
          <button className="btn-secondary secondary" onClick={handleDownloadPdf}>
            <span className="material-icons-sharp">picture_as_pdf</span>
            PDF
          </button>
        </div>
      </div>

      <div className="report-grid">
        {overviewCards.map((card) => (
          <article key={card.label} className={`report-metric ${card.tone}`}>
            <span className="material-icons-sharp">{card.icon}</span>
            <div>
              <p>{card.label}</p>
              <h2>{card.value}</h2>
            </div>
          </article>
        ))}
      </div>

      <div className="chart-grid">
        <section className="chart-card">
          <div className="report-card-header">
            <h3>Status distribution</h3>
          </div>
          <div className="chart-bars">
            {statusChartRows.map((row) => (
              <div className="chart-row" key={`status-${row.label}`}>
                <div className="chart-label">
                  <span>{row.label}</span>
                  <strong>{row.count}</strong>
                </div>
                <div className="chart-track">
                  <div
                    className="chart-fill status"
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="chart-card">
          <div className="report-card-header">
            <h3>Organisation type</h3>
          </div>
          <div className="chart-bars">
            {organisationRows.map((row) => (
              <div className="chart-row" key={`org-${row.label}`}>
                <div className="chart-label">
                  <span>{getOrganisationTypeLabel(row.value)}</span>
                  <strong>{row.count}</strong>
                </div>
                <div className="chart-track">
                  <div
                    className="chart-fill org"
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="chart-card chart-card-wide">
          <div className="report-card-header">
            <h3>Workflow trend</h3>
          </div>
          <div className="chart-bars trend-bars">
            {trendRows.map((row) => {
              return (
                <div className="trend-row" key={row.month}>
                  <div className="chart-label">
                    <span>{row.month ? formatDate(row.month) : "-"}</span>
                  </div>
                  <div className="mini-bars">
                    {[
                      ["Created", row.created ?? 0, "created"],
                      ["Approved", row.approved ?? 0, "approved"],
                      ["Activated", row.activated ?? 0, "activated"],
                      ["Completed", row.completed ?? 0, "completed"],
                    ].map(([label, value, cls]) => (
                      <div className="mini-bar-group" key={`${row.month}-${label}`}>
                        <div className={`mini-bar ${cls}`} style={{ height: `${(Number(value) / trendPeak) * 100}%` }} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="report-section">
        <ReportTable
          title="Status breakdown"
          labelHeading="Status"
          rows={statusRows.map((item) => ({
            ...item,
            label: getStatusLabel(item.value),
          }))}
          emptyMessage="No status data available."
        />

        <ReportTable
          title="Intake cohort"
          labelHeading="Cohort"
          rows={cohortRows.map((item) => ({
            ...item,
            label:
              intakeCohorts.find((cohort) => cohort.value === item.value)?.label ??
              item.value,
          }))}
          emptyMessage="No cohort data available."
        />
      </div>

      <div className="report-section">
        <section className="report-card">
          <div className="report-card-header">
            <h3>Top organisations</h3>
          </div>
          <div className="table-container">
            <table className="data-table report-table">
              <thead>
                <tr>
                  <th>Organisation</th>
                  <th>Placements</th>
                </tr>
              </thead>
              <tbody>
                {(workload.topOrganisations ?? []).length === 0 ? (
                  <tr>
                    <td colSpan="2" className="no-results">
                      <p>No organisation data available.</p>
                    </td>
                  </tr>
                ) : (
                  (workload.topOrganisations ?? []).map((row) => (
                    <tr key={row.key ?? row.label}>
                      <td>{row.label}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="report-card">
          <div className="report-card-header">
            <h3>Supervisor load</h3>
          </div>
          <div className="table-container">
            <table className="data-table report-table">
              <thead>
                <tr>
                  <th>Supervisor</th>
                  <th>Placements</th>
                </tr>
              </thead>
              <tbody>
                {(workload.topWorkplaceSupervisors ?? []).length === 0 ? (
                  <tr>
                    <td colSpan="2" className="no-results">
                      <p>No workplace supervisor data available.</p>
                    </td>
                  </tr>
                ) : (
                  (workload.topWorkplaceSupervisors ?? []).map((row) => (
                    <tr key={`wp-${row.key ?? row.label}`}>
                      <td>{row.label}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="report-card">
          <div className="report-card-header">
            <h3>Academic supervisor load</h3>
          </div>
          <div className="table-container">
            <table className="data-table report-table">
              <thead>
                <tr>
                  <th>Supervisor</th>
                  <th>Placements</th>
                </tr>
              </thead>
              <tbody>
                {(workload.topAcademicSupervisors ?? []).length === 0 ? (
                  <tr>
                    <td colSpan="2" className="no-results">
                      <p>No academic supervisor data available.</p>
                    </td>
                  </tr>
                ) : (
                  (workload.topAcademicSupervisors ?? []).map((row) => (
                    <tr key={`ac-${row.key ?? row.label}`}>
                      <td>{row.label}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
