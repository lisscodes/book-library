import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../redux/features/books/slice";
import authReducer from "../redux/features/auth/slice";
import Header from "../components/Header";

// Mock do signOut (Supabase)
jest.mock("../services/authService", () => ({
  signOut: jest.fn(() => Promise.resolve({})),
}));

// Mock do useNavigate (React Router)
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header component", () => {
  const setup = () => {
    const store = configureStore({
      reducer: {
        books: booksReducer,
        auth: authReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    return { store };
  };

  it("renderiza o título e os botões principais", () => {
    setup();

    expect(screen.getByText("📚 Book Library")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar livros...")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
  });

  it("dispara o dispatch ao digitar no campo de busca", () => {
    const { store } = setup();

    const input = screen.getByPlaceholderText("Buscar livros...");

    fireEvent.change(input, { target: { value: "test" } });

    // Verifica se o valor foi despachado pro Redux
    expect(store.getState().books.searchQuery).toBe("test");
  });

  it("executa o fluxo de logout com sucesso", async () => {
    const { store } = setup();
    const logoutButton = screen.getByText("Sair");

    fireEvent.click(logoutButton);

    await waitFor(() => {
      // Após o logout, deve ter limpado a sessão e redirecionado
      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(store.getState().auth.session).toBeNull();
    });
  });
});
