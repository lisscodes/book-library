import React, { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  fetchBooks,
} from "../redux/features/books/thunks";
import {
  setQuery,
  setLanguage,
  setTopic,
  setSort,
} from "../redux/features/books/slice";
import BookCard from "../components/BookCard";
import { BookSkeleton } from "../components/BookSkeleton";
import { Search, SlidersHorizontal } from "lucide-react";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { books, searchQuery, isLoading, error, next, previous } = useAppSelector(
    (state) => state.books
  );

  const [search, setSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!books.length && !isLoading && !error) {
      dispatch(fetchBooks(undefined));
    }
  }, [dispatch, books.length, isLoading, error]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(setQuery(value));
    dispatch(fetchBooks(undefined));
  };

  const handleFilterChange = (
    type: "language" | "topic" | "sort",
    value: string
  ) => {
    if (type === "language") dispatch(setLanguage(value));
    if (type === "topic") dispatch(setTopic(value));
    if (type === "sort") dispatch(setSort(value));
    dispatch(fetchBooks(undefined));
  };

  const handleBookClick = useCallback(
    (id: number) => navigate(`/details/${id}`),
    [navigate]
  );

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shouldRenderSkeleton = (!books.length || isLoading) && !error;

  if (shouldRenderSkeleton) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Search bar (mobile) */}
          <div className="md:hidden mb-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
              <Search className="text-gray-500 mr-2" size={18} />
              <input
                type="text"
                value={search}
                onChange={handleInputChange}
                placeholder="Search books..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-3 text-center">
          The book server is temporarily unavailable 😢
        </p>
        <button
          onClick={() => dispatch(fetchBooks(undefined))}
          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="p-6">
        {/* 🔍 Search bar (mobile only) */}
        <div className="md:hidden mb-4 relative">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <Search className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder="Search books..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2 p-2 bg-white text-purple-700 rounded-md hover:bg-purple-50 transition flex items-center gap-1"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Filter dropdown (mobile) */}
          {showFilters && (
            <div
              ref={filtersRef}
              className="absolute top-14 left-0 right-0 bg-white text-gray-800 rounded-lg shadow-lg p-4 border border-purple-200 z-50"
            >
              <label className="block mb-3">
                <span className="text-sm font-medium text-purple-700">Language:</span>
                <select
                  onChange={(e) =>
                    handleFilterChange("language", e.target.value)
                  }
                  className="w-full mt-1 border rounded-md p-1 text-gray-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                >
                  <option value="">All</option>
                  <option value="pt">Portuguese</option>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium text-purple-700">Topic:</span>
                <select
                  onChange={(e) =>
                    handleFilterChange("topic", e.target.value)
                  }
                  className="w-full mt-1 border rounded-md p-1 text-gray-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                >
                  <option value="">All</option>
                  <option value="fiction">Fiction</option>
                  <option value="history">History</option>
                  <option value="science">Science</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="biography">Biography</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-purple-700">Sort by:</span>
                <select
                  onChange={(e) =>
                    handleFilterChange("sort", e.target.value)
                  }
                  className="w-full mt-1 border rounded-md p-1 text-gray-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                >
                  <option value="">Default</option>
                  <option value="popular">Popularity</option>
                  <option value="downloads">Downloads</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {/* 🔹 Grid de livros */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBooks.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              index={index}
              onClick={handleBookClick}
            />
          ))}
        </div>

        {/* 🔹 Paginação */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => previous && dispatch(fetchBooks(previous))}
            disabled={!previous}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              previous
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          <button
            onClick={() => next && dispatch(fetchBooks(next))}
            disabled={!next}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              next
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
