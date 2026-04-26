/**
 * Calculate the total number of pages
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Number of items per page
 * @returns {number} Total pages
 */
export function calculateTotalPages(totalItems, itemsPerPage) {
  if (itemsPerPage <= 0) return 0;
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Get items for the current page
 * @param {Array} items - Full list of items
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Array} Paginated items for the current page
 */
export function getPaginatedItems(items, currentPage, itemsPerPage) {
  if (!items || items.length === 0) return [];
  if (currentPage < 1) return [];
  if (itemsPerPage <= 0) return [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return items.slice(startIndex, endIndex);
}