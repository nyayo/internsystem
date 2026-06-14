import { describe, expect, it } from "@jest/globals";
import {
  normalizePlacement,
  normalizeWeeklyLog,
  normalizeLog,
} from "./normalizer";
import {
  calculateInternshipProgress,
  getCurrentWeekNumber,
  getTotalWeeks,
} from "../data/studentDashboardData";

describe("placement and weekly log helpers", () => {
  it("normalizes placement payloads", () => {
    expect(
      normalizePlacement({
        id: 7,
        student_name: "Jane Doe",
        student_number: "ST-01",
        programme: "Computer Science",
        organisation_name: "Acme Ltd",
        organisation_type: "private",
        organisation_district: "Kampala",
        department: "IT",
        status: "active",
        created_at: "2026-06-01T00:00:00Z",
      }),
    ).toMatchObject({
      id: 7,
      student: {
        name: "Jane Doe",
        regNumber: "ST-01",
        program: "Computer Science",
      },
      organisationName: "Acme Ltd",
      status: "active",
      createdAt: "2026-06-01T00:00:00Z",
    });
  });

  it("normalizes weekly log payloads", () => {
    expect(
      normalizeWeeklyLog({
        id: 11,
        placement: 5,
        student_name: "Jane Doe",
        student_number: "ST-01",
        organisation: "Acme Ltd",
        week_number: 3,
        status: "submitted",
        activities_performed: "Implemented dashboard widgets",
        academic_grade: "18.5",
      }),
    ).toMatchObject({
      id: 11,
      placement: 5,
      student: {
        name: "Jane Doe",
        regNumber: "ST-01",
        organisation: "Acme Ltd",
      },
      weekNumber: 3,
      status: "submitted",
      activitiesPerformed: "Implemented dashboard widgets",
      academicGrade: "18.5",
    });
  });

  it("normalizes general log payloads", () => {
    expect(
      normalizeLog({
        id: 21,
        student_name: "John Smith",
        student_number: "ST-02",
        organisation: "Omega Corp",
        programme: "Information Systems",
        week_number: 8,
        status: "endorsed",
        submitted_at: "2026-06-10T09:00:00Z",
      }),
    ).toMatchObject({
      id: 21,
      student: {
        name: "John Smith",
        regNumber: "ST-02",
        organisation: "Omega Corp",
        programme: "Information Systems",
      },
      weekNumber: 8,
      status: "endorsed",
      submittedAt: "2026-06-10T09:00:00Z",
    });
  });

  it("returns zero progress for future internships", () => {
    expect(
      calculateInternshipProgress("2999-01-01", "2999-02-01"),
    ).toBe(0);
    expect(getCurrentWeekNumber("2999-01-01")).toBe(0);
  });

  it("computes total weeks for a valid internship period", () => {
    expect(getTotalWeeks("2026-06-01", "2026-06-15")).toBe(2);
  });
});
