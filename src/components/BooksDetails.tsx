import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import type { RootState } from "../redux/store";

function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { books } = useSelector((store: RootState) => store.books);

  const bookId = parseInt(id || "", 10);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Header />
        <p className="text-gray-500">Livro não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{book.title}</h1>
        <p className="text-gray-600 mb-4">
          Autor: {book.authors?.[0]?.name || "Desconhecido"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Downloads: {book.download_count || 0}
        </p>
        <div className="flex flex-wrap gap-2">
          {book.subjects?.map((subject, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
