import React from "react";
import type { Book } from "../redux/features/books/types";

interface BookCardProps {
  book: Book;
  index: number;
  onClick: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, index, onClick }) => {
  const img = book?.formats?.["image/jpeg"];
  const author = book?.authors?.[0]?.name;

  return (
    <button
      type="button"
      data-testid="clickBook"
      onClick={() => onClick(book.id)}
      className={`flex flex-col items-center gap-2 rounded-xl p-4 shadow-md transition hover:scale-105 hover:bg-gray-100 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      {img && (
        <img
          src={img}
          alt={book.title}
          className="w-40 h-56 object-cover rounded-md"
        />
      )}

      <h2 className="text-lg font-semibold text-gray-800 text-center">
        {book.title}
      </h2>
      <p className="text-sm text-gray-600">{author}</p>
    </button>
  );
};

export default React.memo(BookCard);
