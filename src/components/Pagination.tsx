"use client";

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

function getPageItems(page: number, totalPages: number): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: (number | "ellipsis-start" | "ellipsis-end")[] = [1];

  if (page > 4) items.push("ellipsis-start");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }

  if (page < totalPages - 3) items.push("ellipsis-end");
  items.push(totalPages);
  return items;
}

export function Pagination({ page, pageSize, totalItems, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems === 0) return null;

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);
  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-200 bg-slate-50">
      <p className="text-xs text-slate-600">
        Menampilkan <span className="font-semibold">{firstItem.toLocaleString("id-ID")}</span>–
        <span className="font-semibold">{lastItem.toLocaleString("id-ID")}</span> dari{" "}
        <span className="font-semibold">{totalItems.toLocaleString("id-ID")}</span> data
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Navigasi halaman">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Halaman sebelumnya"
          >
            ‹
          </button>

          {pageItems.map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`min-w-8 px-2 py-1.5 rounded-md border text-xs font-semibold transition ${
                  item === page
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="px-1 text-xs text-slate-400" aria-hidden="true">
                …
              </span>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Halaman berikutnya"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  );
}
