export function Pagination({ currentPage, totalPages, onPageChange }) {
  const createPageRange = () => {
    const pages = [];

    if (totalPages <= 20) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); 

      if (currentPage > 6) {
        pages.push("dots-prev");
      }

      for (let i = currentPage - 5; i <= currentPage + 5; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 5) {
        pages.push("dots-next");
      }

      pages.push(totalPages); 
    }

    return pages;
  };

  const pagesToRender = createPageRange();

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        className="px-3 py-1 bg-orange-400 rounded hover:bg-orange-500"
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
            className={`px-3 py-1 rounded ${
              page === currentPage
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
        className="px-3 py-1 bg-orange-400 rounded hover:bg-orange-500"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
}
