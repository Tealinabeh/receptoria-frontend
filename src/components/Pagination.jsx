export function Pagination({ currentPage, totalPages, onPageChange }) {
  const createPageRange = () => {
    const pages = [];
    const pageRange = 2;
    const showAllPagesThreshold = 7;

    if (totalPages <= showAllPagesThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > pageRange + 2) {
        pages.push("dots-prev");
      }

      let startPage = Math.max(2, currentPage - pageRange);
      let endPage = Math.min(totalPages - 1, currentPage + pageRange);

      if (currentPage <= pageRange + 1) {
        endPage = Math.min(totalPages - 1, 2 * pageRange + 1);
      }
      if (currentPage >= totalPages - pageRange) {
        startPage = Math.max(2, totalPages - 2 * pageRange);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - (pageRange + 1)) {
        pages.push("dots-next");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pagesToRender = createPageRange();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
      <button
        className="px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-500 disabled:bg-gray-300"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>

      {pagesToRender.map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded transition-colors ${page === currentPage
                ? "bg-orange-400 text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {page}
          </button>
        ) : (
          <span
            key={idx}
            className="px-3 py-1 text-gray-400 cursor-default select-none"
          >
            ...
          </span>
        )
      )}

      <button
        className="px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-500 disabled:bg-gray-300"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
}