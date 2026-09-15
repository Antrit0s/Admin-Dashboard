import { Pagination } from "@mui/material";
import React, { useState } from "react";

export default function Test() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const items = Array.from({ length: 100 }, (_, index) => index + 1);

  const startIndex = (page - 1) * pageSize;

  const totalPages = Math.ceil(items.length / pageSize);

  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <div>
        {paginatedItems.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
      />
    </>
  );
}
