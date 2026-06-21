import { useState, useMemo, useEffect } from "react";

const useTableController = ({
  data = [],
  searchKeys = [],
  filterKey = "",
}) => {

  const safeData = Array.isArray(data) ? data : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const processedData = useMemo(() => {
    let result = [...safeData];

    if (searchQuery && searchKeys?.length > 0) {
      result = result.filter(item =>
        searchKeys.some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    if (activeFilter !== "All" && filterKey) {
      result = result.filter(
        item => item[filterKey] === activeFilter
      );
    }

    return result;

  }, [safeData, searchQuery, activeFilter, searchKeys, filterKey]);

  const totalPages = Math.ceil(
    processedData.length / recordsPerPage
  );

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const currentData = processedData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    currentData,
    recordsPerPage,
    setRecordsPerPage,
    totalRecords: processedData.length,
  };
};

export default useTableController;