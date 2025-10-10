import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BookCard from "../components/BookCard";
import { fetchBooks } from "../redux/features/books/thunks";
import type { RootState, AppDispatch } from "../redux/store";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { books, searchQuery, isLoading, error } = useSelector(
    (state: RootState) => state.books
  );

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

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

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 animate-pulse">Carregando livros...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">Erro ao carregar livros 😢</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
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
