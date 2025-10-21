import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import BookDetails from "../pages/BookDetails";
import FavoriteBooks from "../pages/FavoritesBooks";
import WaitList from "../pages/WaitList";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Loans from "../pages/Loans";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/details/:id"
        element={
          <PrivateRoute>
            <BookDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <FavoriteBooks />
          </PrivateRoute>
        }
      />
      <Route
        path="/waitlist"
        element={
          <PrivateRoute>
            <WaitList />
          </PrivateRoute>
        }
      />
      <Route
        path="/loans"
        element={
          <PrivateRoute>
            <Loans />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
