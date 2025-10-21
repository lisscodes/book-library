import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchWaitlist } from "../redux/features/waitList/thunks";
import BookCard from "../components/BookCard";
import { BookSkeleton } from "../components/BookSkeleton";

export default function WaitList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.waitlist
  );

  useEffect(() => {
    dispatch(fetchWaitlist());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-6">
        Ocorreu um erro ao carregar sua lista de espera.
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Nenhum livro na sua lista de espera no momento.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Lista de Espera</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((entry, index) =>
          entry.book ? (
            <BookCard
              key={entry.book.id}
              book={entry.book}
              index={index}
              onClick={() => {}}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
