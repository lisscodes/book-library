import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchWaitlist, removeWaitlist } from "../redux/features/waitList/thunks";
import BookCard from "../components/BookCard";
import { BookSkeleton } from "../components/BookSkeleton";
import { toast } from "react-toastify";
import { supabase } from "../services/supabaseClient";

export default function WaitList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.waitlist
  );

  useEffect(() => {
    dispatch(fetchWaitlist());
  }, [dispatch]);

  const handleRemove = async (entryId: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You must be logged in to remove books from your waitlist.");
        return;
      }

      await dispatch(removeWaitlist(entryId)).unwrap();
      toast.info("Book removed from your waitlist.");
      dispatch(fetchWaitlist());
    } catch (err) {
      console.error("Error removing from waitlist:", err);
      toast.error("Failed to remove book from waitlist.");
    }
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
        An error occurred while loading your waitlist.
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center text-gray-500 mt-6">
        There are no books in your waitlist at the moment.
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-purple-50 pb-20 md:pb-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        My Waitlist
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((entry, index) =>
          entry.book ? (
            <div
              key={entry.id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center gap-3 relative"
            >
              <div className="w-full max-w-[150px] sm:max-w-[180px]">
                <BookCard book={entry.book} index={index} onClick={() => {}} />
              </div>

              <button
                onClick={() => handleRemove(entry.id)}
                className="mt-3 bg-purple-600 text-white text-sm sm:text-base px-4 py-1.5 rounded-lg hover:bg-purple-700 transition"
              >
                Remove
              </button>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
