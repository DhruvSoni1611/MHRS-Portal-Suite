import React from "react";

import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const pageSizeOptions = [
    { value: "10", label: "10 per page" },
    { value: "25", label: "25 per page" },
    { value: "50", label: "50 per page" },
    { value: "100", label: "100 per page" },
  ];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range?.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots?.push(1, "...");
    } else {
      rangeWithDots?.push(1);
    }

    rangeWithDots?.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots?.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots?.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {totalItems} of {totalItems} patients
        </div>
        <div className="w-40">
          <Select
            options={pageSizeOptions}
            value={itemsPerPage?.toString()}
            onChange={(value) => onItemsPerPageChange(parseInt(value))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} patients
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          iconName="ChevronLeft"
          className="px-3"
        />

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages()?.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="px-3 py-2 min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          iconName="ChevronRight"
          className="px-3"
        />
      </div>
      {/* Page Size Selector */}
      <div className="w-40">
        <Select
          options={pageSizeOptions}
          value={itemsPerPage?.toString()}
          onChange={(value) => onItemsPerPageChange(parseInt(value))}
        />
      </div>
    </div>
  );
};

export default Pagination;
