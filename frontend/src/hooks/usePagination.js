import { useCallback, useMemo, useState } from "react";
import { calculateTotalPages, getPaginatedItems } from "../utils/listUtils";

export default function usePagination(items, initialItemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = useMemo(
    () => calculateTotalPages(items.length, itemsPerPage),
    [items.length, itemsPerPage],
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(
    () => getPaginatedItems(items, safeCurrentPage, itemsPerPage),
    [items, safeCurrentPage, itemsPerPage],
  );

  const handlePageChange = useCallback((page) => {
    const clampedPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clampedPage);
  }, [totalPages]);

  const handleItemsPerPageChange = useCallback((pageSize) => {
    setItemsPerPage(pageSize);
    setCurrentPage(1);
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safeCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    setCurrentPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange,
    resetPagination,
  };
}
