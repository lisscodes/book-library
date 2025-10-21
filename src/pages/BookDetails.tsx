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

  // 🔹 Buscar detalhes do livro
  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [dispatch, id]);

  // ======================================================
  // 🔹 Empréstimo
  // ======================================================
  const handleLoan = async () => {
  if (!book) return;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    toast.error("É necessário estar logado para emprestar livros.");
    console.error("Usuário não autenticado:", authError);
    return;
  }

  console.log("📚 Tentando criar empréstimo para:", book.id, "por usuário:", user.id);

  dispatch(
    createLoan({
      user_id: user.id,
      book_id: String(book.id),
    })
  )
    .unwrap()
    .then((res) => {
      console.log("Empréstimo criado com sucesso:", res);
      toast.success("Livro emprestado com sucesso!");
      navigate("/loans");
    })
    .catch((err) => {
      console.error("Erro ao criar empréstimo:", err);

      const message = err?.message || err;

      if (typeof message === "string" && message.includes("já está emprestado")) {
        toast.warning("Você já possui um empréstimo ativo deste livro.");
      } else {
        toast.error("Falha ao registrar o empréstimo. Tente novamente mais tarde.");
      }
    });
};

  // ======================================================
  // 🔹 Lista de Espera
  // ======================================================
  const handleWaitlist = async () => {
    if (!book) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("É necessário estar logado para entrar na lista de espera.");
      console.error("Usuário não autenticado:", authError);
      return;
    }

    console.log("🕒 Tentando adicionar à lista de espera:", book.id);

    dispatch(
      joinWaitlist({
        user_id: user.id,
        book_id: String(book.id),
      })
    )
      .unwrap()
      .then((res) => {
        console.log("✅ Adicionado à lista de espera:", res);
        toast.info("🕒 Livro adicionado à lista de espera!");
        navigate("/waitlist");
      })
      .catch((err) => {
        console.error("❌ Erro ao adicionar à lista de espera:", err);
        toast.error("Falha ao entrar na lista de espera.");
      });
  };

  // ======================================================
  // 🔹 Favoritar
  // ======================================================
  const handleFavorite = async () => {
    if (!book) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("É necessário estar logado para favoritar livros.");
      console.error("Usuário não autenticado:", authError);
      return;
    }

    console.log("💜 Tentando favoritar livro:", book.id);

    dispatch(
      toggleFavorite({
        user_id: user.id,
        book_id: String(book.id),
      })
    )
      .unwrap()
      .then((res) => {
        console.log("✅ Favorito atualizado:", res);
        toast.success("💜 Favoritos atualizados!");
      })
      .catch((err) => {
        console.error("❌ Erro ao atualizar favorito:", err);
        toast.error("Falha ao atualizar favorito.");
      });
  };

  // ======================================================
  // 🔹 Estados de carregamento e erro
  // ======================================================
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
        <p className="text-red-600 text-lg font-semibold">Erro: {error}</p>
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

  // ======================================================
  // 🔹 Renderização principal
  // ======================================================
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
          <button
            onClick={handleLoan}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
          >
            📚 Emprestar
          </button>

          <button
            onClick={handleWaitlist}
            className="bg-yellow-500 text-white px-6 py-2 rounded-xl hover:bg-yellow-600 transition"
          >
            🕒 Lista de espera
          </button>

          <button
            onClick={handleFavorite}
            className="border-2 border-purple-500 text-purple-700 px-6 py-2 rounded-xl hover:bg-purple-50 transition"
          >
            💜 Favoritar
          </button>
        </div>
      </div>
    </div>
  );
}
