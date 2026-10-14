import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage, // 1-indexed
  totalPages,
  totalElements,
  limit = 10,
  onChangePage,
  onChangeLimit,
}) {
  if (totalElements === 0) return null;

  const handlePrevClick = () => {
    if (currentPage > 1) onChangePage(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) onChangePage(currentPage + 1);
  };

  const renderPageButtons = () => {
    const pages = [];
    // Calculate start and end page (1-indexed)
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    
    // Adjust startPage if we are near the end
    if (endPage - startPage < 2 && totalPages >= 3) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onChangePage(i)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            currentPage === i
              ? "bg-admin-primary-600 text-white" 
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-slate-100 text-sm text-slate-500 font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          Tổng số: <span className="text-slate-800 font-bold">{totalElements}</span>
        </div>
        {onChangeLimit && (
          <>
            <div className="w-[1px] h-3 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span>Hiển thị:</span>
              <select
                value={limit}
                onChange={(e) => onChangeLimit(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white text-slate-700 outline-none focus:border-admin-primary-600"
              >
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>/ trang</span>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-4 md:mt-0">
        <button
          onClick={handlePrevClick}
          disabled={currentPage <= 1}
          className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {renderPageButtons()}

        {currentPage + 1 < totalPages && (
          <>
            <span className="px-2 text-gray-400">...</span>
            <button
              onClick={() => onChangePage(totalPages)}
              className="px-4 py-2 text-sm font-semibold bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={handleNextClick}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
