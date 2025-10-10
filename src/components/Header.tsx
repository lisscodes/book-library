import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuery } from "../redux/features/books/slice";
import { signOut } from "../services/authService";
import { signOutSuccess } from "../redux/features/auth/slice";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setQuery(e.target.value));

  const handleLogout = async () => {
    try {
      await signOut(); // encerra sessão no Supabase
      dispatch(signOutSuccess()); // limpa auth no Redux
      navigate("/login"); // redireciona
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md">
      {/* Logo / Título */}
      <button
        onClick={() => navigate("/")}
        className="text-2xl font-bold hover:text-blue-200 transition"
      >
        📚 Book Library
      </button>

      {/* Campo de busca */}
      <input
        type="text"
        onChange={handleInputChange}
        placeholder="Buscar livros..."
        className="w-1/3 px-3 py-2 rounded-md text-gray-800 focus:outline-none"
      />

      {/* Ícones e Logout */}
      <div className="flex gap-4 items-center text-xl">
        <span>⚙️</span>
        <span>🔔</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100 transition"
        >
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Header;
