/**
 * Komponen Pagination reusable
 * Menampilkan maksimal 3 nomor halaman + ellipsis (...) + first/last page
 *
 * Props:
 * - currentPage: halaman aktif
 * - totalPages: total halaman
 * - onPageChange: callback (page) => void
 * - disabled: boolean (opsional)
 */
const Pagination = ({ currentPage, totalPages, onPageChange, disabled = false }) => {
  if (totalPages <= 1) return null;

  /**
   * Logika halaman yang ditampilkan:
   * - Selalu tampilkan halaman pertama dan terakhir
   * - Tampilkan halaman aktif dan 1 tetangga di kiri & kanan
   * - Sisanya diganti "..."
   *
   * Contoh (current=5, total=15):
   *   1 ... 4 5 6 ... 15
   *
   * Contoh (current=1, total=15):
   *   1 2 3 ... 15
   *
   * Contoh (current=15, total=15):
   *   1 ... 13 14 15
   */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // jumlah tetangga kiri & kanan halaman aktif

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Halaman pertama selalu ada
    pages.push(1);

    // Ellipsis kiri
    if (rangeStart > 2) pages.push("...");

    // Halaman di sekitar current
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Ellipsis kanan
    if (rangeEnd < totalPages - 1) pages.push("...");

    // Halaman terakhir selalu ada (jika lebih dari 1)
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  const btnBase =
    "min-w-[36px] h-9 px-2 border rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const btnActive = "bg-cyan-600 text-white border-cyan-600 font-semibold";
  const btnInactive = "border-gray-300 hover:bg-gray-50 text-gray-700";
  const btnNav = "border-gray-300 hover:bg-gray-50 text-gray-700 px-3";

  return (
    <div className="flex items-center gap-1">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className={`${btnBase} ${btnNav}`}
      >
        Previous
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="min-w-[36px] h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className={`${btnBase} ${btnNav}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
