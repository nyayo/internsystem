export function escapeCsvValue(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildTrendSeries(report = {}) {
  const trends = report?.trends ?? {};
  const byMonth = new Map();

  const sources = [
    ["created", trends.created ?? []],
    ["approved", trends.approved ?? []],
    ["activated", trends.activated ?? []],
    ["completed", trends.completed ?? []],
  ];

  sources.forEach(([key, rows]) => {
    rows.forEach((item) => {
      const month = item.month;
      const current = byMonth.get(month) ?? { month };
      current[key] = item.count ?? 0;
      byMonth.set(month, current);
    });
  });

  return Array.from(byMonth.values()).sort((a, b) =>
    String(a.month).localeCompare(String(b.month)),
  );
}

export function normalizeBreakdownRows(rows = []) {
  const total = rows.reduce((sum, row) => sum + Number(row.count ?? 0), 0);
  return rows.map((row) => ({
    ...row,
    percentage: total > 0 ? Number(((Number(row.count ?? 0) / total) * 100).toFixed(1)) : 0,
  }));
}

export function buildReportCsv(report = {}) {
  const overview = report?.overview ?? {};
  const breakdowns = report?.breakdowns ?? {};
  const trends = buildTrendSeries(report);

  const rows = [
    ["section", "label", "count", "share", "month", "created", "approved", "activated", "completed"],
    ["overview", "Total Placements", overview.totalPlacements ?? 0, "", "", "", "", "", ""],
    ["overview", "Active Placements", overview.activePlacements ?? 0, "", "", "", "", "", ""],
    ["overview", "Completed Placements", overview.completedPlacements ?? 0, "", "", "", "", "", ""],
    ["overview", "Pending Approvals", overview.pendingApprovals ?? 0, "", "", "", "", "", ""],
    ["overview", "Pending Logs", overview.pendingLogs ?? 0, "", "", "", "", "", ""],
    ["overview", "Pending Evaluations", overview.pendingEvaluations ?? 0, "", "", "", "", "", ""],
  ];

  const addBreakdown = (section, rowsList = []) => {
    rowsList.forEach((row) => {
      rows.push([
        section,
        row.label ?? row.value ?? "",
        row.count ?? 0,
        row.percentage ?? "",
        "",
        "",
        "",
        "",
        "",
      ]);
    });
  };

  addBreakdown("status", breakdowns.byStatus ?? []);
  addBreakdown("cohort", breakdowns.byCohort ?? []);
  addBreakdown("organisation_type", breakdowns.byOrganisationType ?? []);

  trends.forEach((row) => {
    rows.push([
      "trend",
      "workflow",
      "",
      "",
      row.month ?? "",
      row.created ?? 0,
      row.approved ?? 0,
      row.activated ?? 0,
      row.completed ?? 0,
    ]);
  });

  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
}

export function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadCsv(filename, report) {
  downloadTextFile(filename, buildReportCsv(report), "text/csv;charset=utf-8");
}

export async function downloadReportPdf(filename, report) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const overview = report?.overview ?? {};
  const trends = buildTrendSeries(report);
  const statusRows = normalizeBreakdownRows(report?.breakdowns?.byStatus ?? []);

  let y = 14;
  const addLine = (text, size = 10) => {
    doc.setFontSize(size);
    doc.text(String(text), 14, y);
    y += size === 14 ? 10 : 7;
  };

  addLine("Internship Admin Report", 14);
  addLine(`Total placements: ${overview.totalPlacements ?? 0}`);
  addLine(`Active placements: ${overview.activePlacements ?? 0}`);
  addLine(`Completed placements: ${overview.completedPlacements ?? 0}`);
  addLine(`Pending approvals: ${overview.pendingApprovals ?? 0}`);
  addLine(`Pending logs: ${overview.pendingLogs ?? 0}`);
  addLine(`Pending evaluations: ${overview.pendingEvaluations ?? 0}`);

  y += 4;
  addLine("Status breakdown", 12);
  statusRows.slice(0, 8).forEach((row) => {
    addLine(`${row.label}: ${row.count} (${row.percentage}%)`);
  });

  y += 4;
  addLine("Workflow trend", 12);
  trends.slice(0, 8).forEach((row) => {
    addLine(
      `${row.month}: created ${row.created ?? 0}, approved ${row.approved ?? 0}, activated ${row.activated ?? 0}, completed ${row.completed ?? 0}`,
    );
  });

  doc.save(filename);
}
