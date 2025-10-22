import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useRedux";
import {
  setQuery,
  setLanguage,
  setTopic,
  setSort,
} from "../redux/features/books/slice";
import { fetchBooks } from "../redux/features/books/thunks";
import { signOut } from "../services/authService";
import { signOutSuccess } from "../redux/features/auth/slice";
import {
  Bell,
  User,
  Home,
  Heart,
  BookOpen,
  Search,
  SlidersHorizontal,
  Clock,
} from "lucide-react";

interface HeaderProps {
  isLogged: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLogged }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    dispatch(setQuery(e.target.value));
    dispatch(fetchBooks());
  };

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(signOutSuccess());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleFilterChange = (
    type: "language" | "topic" | "sort",
    value: string
  ) => {
    if (type === "language") dispatch(setLanguage(value));
    if (type === "topic") dispatch(setTopic(value));
    if (type === "sort") dispatch(setSort(value));
    dispatch(fetchBooks());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsMenuOpen(false);
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      )
        setIsMobileMenuOpen(false);
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node))
        setShowFilters(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* 🔹 Header Desktop */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-purple-600 text-white shadow-md relative">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold hover:text-purple-200 transition"
        >
          📚 Book Library
        </button>

        {isLogged && (
          <div className="relative w-1/3 flex items-center">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder="Search books..."
              className="w-full pl-10 pr-3 py-2 rounded-md text-gray-800 focus:outline-none"
            />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2 p-2 bg-white text-purple-700 rounded-md hover:bg-purple-50 transition flex items-center gap-1"
            >
              <SlidersHorizontal size={18} />
              <span className="text-sm font-medium">Filters</span>
            </button>

            {showFilters && (
              <div
                ref={filtersRef}
                className="absolute top-12 right-0 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-72 z-50 border border-purple-200"
              >
                <label className="block mb-3">
                  <span className="text-sm font-medium text-purple-700">
                    Language:
                  </span>
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
                  <span className="text-sm font-medium text-purple-700">
                    Topic:
                  </span>
                  <select
                    onChange={(e) => handleFilterChange("topic", e.target.value)}
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
                  <span className="text-sm font-medium text-purple-700">
                    Sort by:
                  </span>
                  <select
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
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
        )}

        {isLogged ? (
          <div className="flex items-center gap-4 text-xl">
            <Bell className="cursor-pointer hover:text-purple-200 transition" />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 hover:text-purple-200 transition"
              >
                <User className="w-6 h-6" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2 border border-purple-200 z-[9999]">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                  >
                    Favorites
                  </button>
                  <button
                    onClick={() => {
                      navigate("/loans");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                  >
                    Loans
                  </button>
                  <button
                    onClick={() => {
                      navigate("/waitlist");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                  >
                    Waitlist
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-sm bg-white text-purple-700 px-3 py-1 rounded-md hover:bg-purple-50 transition"
          >
            Sign In
          </button>
        )}
      </nav>

      {/* 🔹 Mobile Bottom Bar */}
      {isLogged && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white text-gray-700 shadow-md flex justify-around items-center py-2 border-t border-purple-200 md:hidden">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center text-sm hover:text-purple-700 transition"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => navigate("/favorites")}
            className="flex flex-col items-center text-sm hover:text-purple-700 transition"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">Favorites</span>
          </button>

          <button
            onClick={() => navigate("/loans")}
            className="flex flex-col items-center text-sm hover:text-purple-700 transition"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs mt-1">Loans</span>
          </button>

          <button
            onClick={() => navigate("/waitlist")}
            className="flex flex-col items-center text-sm hover:text-purple-700 transition"
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Waitlist</span>
          </button>

          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col items-center text-sm hover:text-purple-700 transition"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>

            {isMobileMenuOpen && (
              <div className="absolute bottom-12 right-0 w-36 bg-white text-gray-800 rounded-lg shadow-lg py-2 border border-purple-200">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-red-600"
                >
                  Sign Out
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
