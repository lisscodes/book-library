import { useParams } from "react-router-dom";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        📖 Detalhes do Livro
      </h1>
      <p className="text-lg text-purple-800">
        ID do livro selecionado: <span className="font-semibold">{id}</span>
      </p>
    </div>
  );
}
