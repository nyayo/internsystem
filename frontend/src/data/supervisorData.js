// Mock data for Workplace and Academic Supervisor Dashboards
import { formatDateTimeValue, formatDateValue } from "../utils/dateUtils";

// Log status display helpers
export const getLogStatusBadgeClass = (status) => {
  switch (status) {
    case 'submitted': return 'warning';
    case 'endorsed': return 'info';
    case 'assessed': return 'success';
    case 'closed': return 'secondary';
    case 'resubmit': return 'danger';
    default: return 'secondary';
  }
};

export const getEvaluationStatusBadgeClass = (status) => {
  switch (status) {
    case 'not_started': return 'secondary';
    case 'in_progress': return 'warning';
    case 'submitted': return 'info';
    case 'acknowledged': return 'success';
    default: return 'secondary';
  }
};

export const formatDate = (dateString) => {
  return formatDateValue(dateString, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  return formatDateTimeValue(dateString);
};

