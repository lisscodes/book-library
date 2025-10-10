import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface PrivateRouteProps {
  children: React.ReactElement;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { session } = useSelector((state: RootState) => state.auth);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
