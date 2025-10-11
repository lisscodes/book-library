import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../redux/features/books/slice";
import BookDetails from "../pages/BookDetails";
import myBooks from "./books";

const store = configureStore({
  reducer: { books: booksReducer },
  preloadedState: {
    books: { books: myBooks, isLoading: false, searchQuery: "", error: null },
  },
});

describe("BookDetails component", () => {
  it("renders book details correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/details/1513"]}>
          <Routes>
            <Route path="/details/:id" element={<BookDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Detalhes do Livro/i)).toBeInTheDocument();
    expect(screen.getByText(/ID do livro selecionado/i)).toBeInTheDocument();
    expect(screen.getByText("1513")).toBeInTheDocument();

  });
});
