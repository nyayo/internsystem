import {
  formatDateRange as formatDateRangeValue,
  formatDateValue,
} from "../utils/dateUtils";
import { loadJSON, removeStorageItem, saveJSON } from "../services/storageService";

// Weekly log status choices
export const weeklyLogStatusChoices = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'endorsed', label: 'Endorsed' },
  { value: 'resubmit', label: 'Resubmit' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'closed', label: 'Closed' },
];

// Helper functions
export const getWeeklyLogStatusLabel = (status) => {
  const choice = weeklyLogStatusChoices.find(c => c.value === status);
  return choice ? choice.label : status;
};

export const getWeeklyLogStatusClass = (status) => {
  const classes = {
    draft: 'muted',
    submitted: 'info',
    under_review: 'warning',
    endorsed: 'primary',
    resubmit: 'danger',
    assessed: 'success',
    closed: 'muted-outline',
  };
  return classes[status] || '';
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const toUTCDateOnly = (value) => {
  if (!value) return null;
  const dateOnly = typeof value === "string" ? value.split("T")[0] : value;
  const parsed = new Date(`${dateOnly}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const calculateInternshipProgress = (startDate, endDate) => {
  const start = toUTCDateOnly(startDate);
  const end = toUTCDateOnly(endDate);
  const today = toUTCDateOnly(new Date().toISOString());

  if (!start || !end || !today) return 0;
  
  if (today < start) return 0;
  if (today > end) return 100;
  
  const totalDays = Math.max(1, Math.floor((end - start) / DAY_IN_MS));
  const elapsedDays = Math.max(0, Math.floor((today - start) / DAY_IN_MS));
  
  return Math.round((elapsedDays / totalDays) * 100);
};

export const getCurrentWeekNumber = (startDate) => {
  const start = toUTCDateOnly(startDate);
  const today = toUTCDateOnly(new Date().toISOString());

  if (!start || !today) return 0;
  
  if (today < start) return 0;
  
  const daysDiff = Math.max(0, Math.floor((today - start) / DAY_IN_MS));
  return Math.floor(daysDiff / 7) + 1;
};

export const getTotalWeeks = (startDate, endDate) => {
  const start = toUTCDateOnly(startDate);
  const end = toUTCDateOnly(endDate);

  if (!start || !end || end <= start) return 0;

  const daysDiff = Math.floor((end - start) / DAY_IN_MS);
  return Math.max(1, Math.floor(daysDiff / 7));
};

export const formatDate = (dateString) => {
  return formatDateValue(dateString, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateRange = (startDate, endDate) => {
  return formatDateRangeValue(startDate, endDate);
};

// Draft persistence keys
export const DRAFT_KEYS = {
  placement: 'student_placement_draft',
  weeklyLog: 'student_weekly_log_draft',
};

// Get draft from localStorage
export const getDraft = (key) => {
  return loadJSON(key, null);
};

// Save draft to localStorage
export const saveDraft = (key, data) => {
  saveJSON(key, data);
};

// Clear draft from localStorage
export const clearDraft = (key) => {
  removeStorageItem(key);
};

// Student sidebar navigation links
export const studentNavLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'placement', label: 'My Placement', icon: 'work' },
  { id: 'logs', label: 'Weekly Logs', icon: 'edit_note' },
  { id: 'evaluations', label: 'Evaluations', icon: 'assessment' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
