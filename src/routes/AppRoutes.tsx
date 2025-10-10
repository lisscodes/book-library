import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import BookDetails from "../pages/BookDetails";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rota protegida */}
      <Route
        path="/details/:id"
        element={
          <PrivateRoute>
            <BookDetails />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Home />} />
    </Routes>
  );
}
