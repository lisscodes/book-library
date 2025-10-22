import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchLoans, returnLoan } from "../redux/features/loans/thunks";
import BookCard from "../components/BookCard";
import { BookSkeleton } from "../components/BookSkeleton";
import { toast } from "react-toastify";

export default function Loans() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.loans
  );

  useEffect(() => {
    dispatch(fetchLoans());
  }, [dispatch]);

  const handleReturn = (loanId: string) => {
    dispatch(returnLoan({ loan_id: loanId }))
      .unwrap()
      .then(() => toast.success("Book successfully returned!"))
      .catch(() => toast.error("Failed to return the book."));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-6">
        Error loading loans: {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center text-gray-500 mt-6">
        You don’t have any registered loans yet.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-purple-50 pb-20 md:pb-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        My Loans
      </h2>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((loan, index) =>
          loan.book ? (
            <div
              key={loan.id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center gap-3 relative"
            >
              {/* Book cover */}
              <div className="w-full max-w-[150px] sm:max-w-[180px]">
                <BookCard book={loan.book} index={index} onClick={() => {}} />
              </div>

              {/* Status and details */}
              <div className="mt-3 flex flex-col items-center w-full">
                <p className="text-sm sm:text-base text-gray-600">
                  Status:{" "}
                  <span
                    className={
                      loan.status === "active"
                        ? "text-yellow-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {loan.status === "active" ? "Active" : "Returned"}
                  </span>
                </p>

                {loan.due_date && loan.status === "active" && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Return by:{" "}
                    {new Date(loan.due_date).toLocaleDateString("en-US")}
                  </p>
                )}

                {/* Return button */}
                {loan.status === "active" && (
                  <button
                    onClick={() => handleReturn(loan.id)}
                    className="mt-3 bg-purple-600 text-white text-sm sm:text-base px-4 py-1.5 rounded-lg hover:bg-purple-700 transition"
                  >
                    Return
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              key={loan.id}
              className="bg-gray-100 rounded-lg p-4 text-center text-gray-500"
            >
              Book {loan.book_id} (data unavailable)
            </div>
          )
        )}
      </div>
    </div>
  );
}
