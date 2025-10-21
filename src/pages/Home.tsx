import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import { BookSkeleton } from "../components/BookSkeleton";
import { fetchBooks } from "../redux/features/books/thunks";
import { setQuery } from "../redux/features/books/slice";
import { Search } from "lucide-react";
import type { RootState, AppDispatch } from "../redux/store";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { books, searchQuery, isLoading, error } = useSelector(
    (state: RootState) => state.books
  );

  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    if (!books.length && !isLoading && !error) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length, isLoading, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(setQuery(value));
  };

  const filteredBooks = useMemo(
    () =>
      books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [books, searchQuery]
  );

  const handleBookClick = useCallback(
    (id: number) => navigate(`/details/${id}`),
    [navigate]
  );

  const recommendedBooks = filteredBooks.slice(0, 8);
  const popularBooks = filteredBooks.slice(8, 16);
  const shouldRenderSkeleton = (!books.length || isLoading) && !error;

  // 🔹 Skeleton de carregamento
  if (shouldRenderSkeleton) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Saudação */}
          <div className="pt-4 pb-2 text-gray-800 md:hidden">
            <h2 className="text-lg font-semibold">
              Hello, <span className="text-blue-600">Dear 👋</span>
            </h2>
          </div>

          {/* Barra de busca no mobile */}
          <div className="md:hidden mb-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
              <Search className="text-gray-500 mr-2" size={18} />
              <input
                type="text"
                value={search}
                onChange={handleInputChange}
                placeholder="Buscar livros..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Recommendation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Popular</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // 🔹 Estado de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 flex flex-col items-center justify-center">
          <p className="text-red-500 text-center mb-3">
            O servidor de livros está temporariamente fora do ar 😢
          </p>
          <button
            onClick={() => dispatch(fetchBooks())}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // 🔹 Conteúdo normal
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="p-6">
        {/* Saudação */}
        <div className="pt-4 pb-2 text-gray-800 md:hidden">
          <h2 className="text-lg font-semibold">
            Hello, <span className="text-blue-600">Dear 👋</span>
          </h2>
        </div>

        {/* Barra de busca (mobile apenas) */}
        <div className="md:hidden mb-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <Search className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder="Buscar livros..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Recommendation */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Recommendation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommendedBooks.map((book, id) => (
              <BookCard
                key={book.id}
                book={book}
                index={id}
                onClick={handleBookClick}
              />
            ))}
          </div>
        </section>

        {/* Popular */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Popular</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {popularBooks.map((book, id) => (
              <BookCard
                key={book.id}
                book={book}
                index={id}
                onClick={handleBookClick}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
