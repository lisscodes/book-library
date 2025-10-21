import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchFavorites, toggleFavorite } from "../redux/features/favorites/thunks";
import { toast } from "react-toastify";
import BookCard from "../components/BookCard";
import { BookSkeleton } from "../components/BookSkeleton";
import { supabase } from "../services/supabaseClient";

export default function FavoriteBooks() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.favorites
  );

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemove = async (bookId: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("É necessário estar logado para remover favoritos.");
        return;
      }

      await dispatch(toggleFavorite({ user_id: user.id, book_id: bookId })).unwrap();
      toast.info("Livro removido dos favoritos.");
      dispatch(fetchFavorites());
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      toast.error("Falha ao remover o favorito.");
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
        Ocorreu um erro ao carregar seus favoritos.
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Você ainda não tem livros favoritados.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-purple-50 pb-20 md:pb-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Meus Favoritos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((fav, index) => {
          if (!fav.book) return null;
          const { book } = fav;

          return (
            <div
              key={book.id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center gap-3 relative"
            >
              <div className="w-full max-w-[150px] sm:max-w-[180px]">
                <BookCard book={book} index={index} onClick={() => {}} />
              </div>

              <div className="mt-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                  {book.title}
                </h3>
                {book.authors && book.authors.length > 0 && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {book.authors[0].name}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleRemove(String(book.id))}
                className="mt-3 bg-purple-600 text-white text-sm sm:text-base px-4 py-1.5 rounded-lg hover:bg-purple-700 transition"
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
