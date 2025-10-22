import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchBookById } from "../redux/features/books/thunks";
import { createLoan } from "../redux/features/loans/thunks";
import { joinWaitlist } from "../redux/features/waitList/thunks";
import { toggleFavorite } from "../redux/features/favorites/thunks";
import { toast } from "react-toastify";
import { supabase } from "../services/supabaseClient";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedBook: book, isLoading, error } = useSelector(
    (state: RootState) => state.books
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [dispatch, id]);

  const handleLoan = async () => {
    if (!book) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("You need to be logged in to borrow books.");
      console.error("Unauthenticated user:", authError);
      return;
    }

    dispatch(
      createLoan({
        user_id: user.id,
        book_id: String(book.id),
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Book successfully borrowed!");
        navigate("/loans");
      })
      .catch((err) => {
        console.error("Error creating loan:", err);
        const message = err?.message || err;
        if (typeof message === "string" && message.includes("already borrowed")) {
          toast.warning("You already have an active loan for this book.");
        } else {
          toast.error("Failed to borrow the book. Please try again later.");
        }
      });
  };

  const handleWaitlist = async () => {
    if (!book) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("You need to be logged in to join the waitlist.");
      console.error("Unauthenticated user:", authError);
      return;
    }

    dispatch(
      joinWaitlist({
        user_id: user.id,
        book_id: String(book.id),
      })
    )
      .unwrap()
      .then(() => {
        toast.info("Book added to the waitlist!");
        navigate("/waitlist");
      })
      .catch((err) => {
        console.error("Error joining waitlist:", err);
        toast.error("Failed to join the waitlist.");
      });
  };

  const handleFavorite = async () => {
    if (!book) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("You need to be logged in to favorite books.");
      console.error("Unauthenticated user:", authError);
      return;
    }

    dispatch(
      toggleFavorite({
        user_id: user.id,
        book_id: String(book.id),
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Favorites updated!");
      })
      .catch((err) => {
        console.error("Error updating favorite:", err);
        toast.error("Failed to update favorites.");
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
        <p className="text-purple-600 text-lg font-medium">
          Loading book details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
        <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
        <p className="text-gray-700 text-lg font-medium">
          Book not found.
        </p>
      </div>
    );
  }

  const coverUrl =
    book.formats["image/jpeg"] ||
    "https://via.placeholder.com/150x220?text=No+Cover";

  return (
    <div className="min-h-screen flex flex-col items-center bg-purple-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl text-center">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-40 h-56 object-cover mx-auto mb-4 rounded-lg shadow-md"
        />

        <h1 className="text-3xl font-bold text-purple-700">{book.title}</h1>

        {book.authors?.length > 0 && (
          <p className="text-lg text-purple-600 mb-2">
            by {book.authors.map((a) => a.name).join(", ")}
          </p>
        )}

        {book.subjects?.length > 0 && (
          <p className="text-sm text-gray-600 italic mb-4">
            {book.subjects.slice(0, 3).join(" • ")}
          </p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleLoan}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
          >
            📚 Borrow
          </button>

          <button
            onClick={handleWaitlist}
            className="bg-yellow-500 text-white px-6 py-2 rounded-xl hover:bg-yellow-600 transition"
          >
            🕒 Waitlist
          </button>

          <button
            onClick={handleFavorite}
            className="border-2 border-purple-500 text-purple-700 px-6 py-2 rounded-xl hover:bg-purple-50 transition"
          >
            💜 Favorite
          </button>
        </div>
      </div>
    </div>
  );
}
