import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchBookById } from "../redux/features/books/thunks";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedBook: book, isLoading, error } = useSelector(
    (state: RootState) => state.books
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
        <p className="text-purple-600 text-lg font-medium">
          Carregando detalhes do livro...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
        <p className="text-red-600 text-lg font-semibold">
          Erro: {error}
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
        <p className="text-gray-700 text-lg font-medium">
          Livro não encontrado.
        </p>
      </div>
    );
  }

  const coverUrl =
    book.formats["image/jpeg"] ||
    "https://via.placeholder.com/150x220?text=Sem+Capa";

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
            por {book.authors.map((a) => a.name).join(", ")}
          </p>
        )}

        {book.subjects?.length > 0 && (
          <p className="text-sm text-gray-600 italic mb-4">
            {book.subjects.slice(0, 3).join(" • ")}
          </p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition">
            📚 Emprestar
          </button>
          <button className="bg-yellow-500 text-white px-6 py-2 rounded-xl hover:bg-yellow-600 transition">
            🕒 Lista de espera
          </button>
          <button className="border-2 border-purple-500 text-purple-700 px-6 py-2 rounded-xl hover:bg-purple-50 transition">
            💜 Favoritar
          </button>
        </div>
      </div>
    </div>
  );
}
