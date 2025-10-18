import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface PrivateRouteProps {
  children: React.ReactElement;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { session, loading, error } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 animate-pulse">
        Verificando sessão...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Erro ao verificar autenticação: {error}
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return children;
}
