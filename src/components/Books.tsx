import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../css/Books.css";
import {
  selectRecommendedBooks,
  selectPopularBooks,
} from "../redux/features/books/selector";
import BookCard from "./BookCard";
import type { Book } from "../redux/features/books/types";
import type { RootState } from "../redux/store";

function Books() {
  const navigate = useNavigate();

  const recommendedBooks = useSelector((state: RootState) =>
    selectRecommendedBooks(state)
  );
  const popularBooks = useSelector((state: RootState) =>
    selectPopularBooks(state)
  );

  const handleButtonClick = useCallback(
    (id: number) => navigate(`/details/${id}`),
    [navigate]
  );

  return (
    <div className="books-section-container">
      {/* Seção 1 - Recommendation */}
      <div className="books-section">
        <h2 className="section-title">Recommendation</h2>
        <div className="books">
          {recommendedBooks.map((book: Book, idx: number) => (
            <BookCard
              key={book.id}
              book={book}
              index={idx}
              onClick={handleButtonClick}
            />
          ))}
        </div>
      </div>

      {/* Seção 2 - Popular */}
      <div className="books-section">
        <h2 className="section-title">Popular</h2>
        <div className="books">
          {popularBooks.map((book: Book, idx: number) => (
            <BookCard
              key={book.id}
              book={book}
              index={idx}
              onClick={handleButtonClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Books;
