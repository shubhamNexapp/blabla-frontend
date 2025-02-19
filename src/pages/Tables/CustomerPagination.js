// Pagination.js
import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const CustomPagination = ({ currentPage, setCurrentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <PaginationItem key={i} active={currentPage === i}>
          <PaginationLink onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
      </PaginationItem>
      {renderPageNumbers()}
      <PaginationItem disabled={currentPage === totalPages}>
        <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

export default CustomPagination;
