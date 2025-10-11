import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../redux/features/books/slice";
import authReducer from "../redux/features/auth/slice";
import BookDetails from "../components/BooksDetails"; // ✅ usa o componente completo
import Home from "../pages/Home"; // ✅ mantém a listagem inicial
import myBooks from "./books";
import { Session } from "@supabase/supabase-js";

// 🧩 Mock global do fetch
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ results: myBooks }),
    })
  ) as jest.Mock;
});

// 🧱 Cria store com *dois reducers*: books e auth
const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
  },
  preloadedState: {
    books: {
      books: myBooks,
      isLoading: false,
      searchQuery: "",
      error: null,
    },
    auth: {
      user: null,
      session: {
        access_token: "mock_token",
        refresh_token: "mock_refresh_token",
        expires_in: 3600,
        token_type: "bearer",
        user: {
          id: "user123",
          email: "test@example.com",
          role: "authenticated",
        },
      } as Partial<Session> as Session,
      loading: false,
      error: null,
    },
  },
});

describe("App integration test", () => {
  it("renders book title and navigates to details showing author", async () => {
    // 🔹 Renderiza a Home (lista de livros)
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    // Espera o livro do mock aparecer
    expect(await screen.findByText("Romeo and Juliet")).toBeInTheDocument();

    // Simula clique no livro (abre detalhes)
    fireEvent.click(screen.getByTestId("clickBook"));

    // 🔹 Renderiza os detalhes diretamente (simula navegação)
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/details/1513"]}>
          <BookDetails />
        </MemoryRouter>
      </Provider>
    );

    // Verifica que o título e o autor aparecem
    expect(await screen.findByText("Romeo and Juliet")).toBeInTheDocument();
    expect(await screen.findByText(/Shakespeare, William/i)).toBeInTheDocument();
  });
});
