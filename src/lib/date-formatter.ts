/**
 * Formats dates in various ways for the application
 */

/**
 * Formats a date from ISO string to a DD-MM-YY format
 */
export function formatDateToDDMMYY(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '-');
}

/**
 * Extracts only the date part from an ISO string (YYYY-MM-DD)
 */
export function getDatePart(isoString: string): string {
  return isoString.split('T')[0];
}

/**
 * Creates a formatted ISO timestamp while preserving the date but updating the time
 */
export function updateTimeInTimestamp(isoString: string, hours: number, minutes: number): string {
  const date = new Date(isoString);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
}

/**
 * Exports date formatter utility functions
 */
export const dateFormatter = {
  formatDateToDDMMYY,
  getDatePart,
  updateTimeInTimestamp
}; 