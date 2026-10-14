import styles from "./Pagination.module.css";
import Icon from "@/components/shared/Icon";
import ChevronLeft from "@/components/Icons/ChevronLeft";
import ChevronRight from "@/components/Icons/ChevronRight";

type PaginationProps = {
  pageIndex: number;
  totalPages: number;
  onPageChange: (index: number) => void;
  scrollTo?: any;
  className?: string;
};

function Pagination({
  pageIndex,
  totalPages,
  onPageChange,
  scrollTo,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const handlePageChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < totalPages && newIndex !== pageIndex) {
      onPageChange(newIndex);
      scrollTo?.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(0, pageIndex - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page ${styles.pagerItem} ${styles.pagerNumbersFull}`}
        >
          <button
            className={`${styles.pagerButton} ${styles.page}${i === pageIndex ? ` ${styles.active}` : ""}`}
            onClick={() => handlePageChange(i)}
            aria-current={i === pageIndex ? "true" : undefined}
            aria-label={`Go to page ${i + 1}`}
          >
            <span className={styles.pagerButtonLabel}>{i + 1}</span>
          </button>
        </li>,
      );
    }

    return pages;
  };

  return (
    <div className="my-4">
      <nav
        className={`${styles.pager} ${className || ""}`}
        role="navigation"
        aria-label="Results data navigation"
      >
        <ol className={`${styles.paginationList}`}>
          {/* First Page Button */}
          <li
            className={`${styles.pageItem} ${pageIndex === 0 ? styles.disabled : ""}`}
          >
            <button
              className={`${styles.pageLink} ${styles.roundedLeft}`}
              onClick={() => handlePageChange(0)}
              disabled={pageIndex === 0}
              aria-label="First"
            >
              First
            </button>
          </li>

          {/* Previous Page Button */}
          <li
            className={`${styles.pageItem} ${pageIndex === 0 ? styles.disabled : ""}`}
          >
            <button
              className={styles.pageLink}
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
              aria-label="Previous"
            >
              Previous
            </button>
          </li>

          <li className={`${styles.pageItem} ${styles.current} disabled`}>
            <button
              className={styles.pageLink}
              type="button"
              disabled
              aria-current="page"
            >
              {pageIndex + 1}
            </button>
          </li>

          {/* Next Page Button */}
          <li
            className={`${styles.pageItem} ${pageIndex === totalPages - 1 ? styles.disabled : ""}`}
          >
            <button
              className={styles.pageLink}
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex === totalPages - 1}
              aria-label="Next"
            >
              Next
            </button>
          </li>

          {/* Last Page Button */}
          <li
            className={`${styles.pageItem} ${pageIndex === totalPages - 1 ? styles.disabled : ""}`}
          >
            <button
              className={styles.pageLink}
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={pageIndex === totalPages - 1}
              aria-label="Last"
            >
              Last
            </button>
          </li>
        </ol>
      </nav>

      <p className={`text-center ${styles.results}`}>
        Viewing page {pageIndex + 1} of {totalPages}
      </p>
    </div>
  );
}

export default Pagination;
