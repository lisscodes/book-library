import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuery } from "../redux/features/books/slice";
import { signOut } from "../services/authService";
import { signOutSuccess } from "../redux/features/auth/slice";
import { Bell, User, Home, Heart, BookOpen, Search } from "lucide-react";

interface HeaderProps {
  isLogged: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLogged }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    dispatch(setQuery(e.target.value));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(signOutSuccess());
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* 🔹 Header (Desktop / Tablet) */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold hover:text-blue-200 transition"
        >
          📚 Book Library
        </button>

        {isLogged && (
          <div className="relative w-1/3">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder="Buscar livros..."
              className="w-full pl-10 pr-3 py-2 rounded-md text-gray-800 focus:outline-none"
            />
          </div>
        )}

        {isLogged ? (
          <div className="flex items-center gap-4 text-xl">
            <Bell className="cursor-pointer hover:text-blue-200 transition" />

            {/* 🔹 Dropdown desktop completo */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 hover:text-blue-200 transition"
              >
                <User className="w-6 h-6" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Perfil
                  </button>
                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Favoritos
                  </button>
                  <button
                    onClick={() => {
                      navigate("/loans");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Empréstimos
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-sm bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100 transition"
          >
            Entrar
          </button>
        )}
      </nav>

      {/* 🔹 Barra inferior (mobile) */}
      {isLogged && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white text-gray-700 shadow-md flex justify-around items-center py-2 border-t border-gray-200 md:hidden">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center text-sm hover:text-blue-600 transition"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Início</span>
          </button>

          <button
            onClick={() => navigate("/favorites")}
            className="flex flex-col items-center text-sm hover:text-blue-600 transition"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">Favoritos</span>
          </button>

          <button
            onClick={() => navigate("/loans")}
            className="flex flex-col items-center text-sm hover:text-blue-600 transition"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs mt-1">Empréstimos</span>
          </button>

          {/* 🔹 Ícone de usuário com dropdown simples (mobile) */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col items-center text-sm hover:text-blue-600 transition"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Perfil</span>
            </button>

            {isMobileMenuOpen && (
              <div className="absolute bottom-12 right-0 w-36 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Perfil
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
