import { describe, expect, it } from "@jest/globals";
import {
  escapeCsvValue,
  buildTrendSeries,
  normalizeBreakdownRows,
  buildReportCsv,
} from "./reportUtils";

describe("reportUtils", () => {
  it("escapes CSV values containing commas", () => {
    expect(escapeCsvValue("Hello, world")).toBe('"Hello, world"');
  });

  it("escapes CSV values containing quotes", () => {
    expect(escapeCsvValue('He said "Hi"')).toBe('"He said ""Hi"""');
  });

  it("builds a merged trend series", () => {
    const report = {
      trends: {
        created: [{ month: "2026-06", count: 2 }],
        completed: [{ month: "2026-06", count: 1 }],
      },
    };
    expect(buildTrendSeries(report)).toEqual([
      { month: "2026-06", created: 2, completed: 1 },
    ]);
  });

  it("adds percentages to breakdown rows", () => {
    expect(
      normalizeBreakdownRows([
        { label: "A", count: 2 },
        { label: "B", count: 3 },
      ]),
    ).toEqual([
      { label: "A", count: 2, percentage: 40 },
      { label: "B", count: 3, percentage: 60 },
    ]);
  });

  it("builds a CSV string with overview and trend data", () => {
    const csv = buildReportCsv({
      overview: { totalPlacements: 5, activePlacements: 2 },
      breakdowns: {
        byStatus: [{ label: "Active", count: 2, percentage: 40 }],
      },
      trends: {
        created: [{ month: "2026-06", count: 2 }],
      },
    });

    expect(csv).toContain("overview,Total Placements,5");
    expect(csv).toContain("status,Active,2,40");
    expect(csv).toContain("trend,workflow,,,2026-06,2,0,0,0");
  });
});
