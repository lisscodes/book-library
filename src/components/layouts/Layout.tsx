// src/components/Layout/Layout.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header";
import { supabase } from "../../services/supabaseClient";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLogged(!!data.user);
    };

    checkUser();

    // Atualiza automaticamente no login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogged(!!session?.user);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Header não aparece em rotas específicas (ex: login)
  const hideHeaderRoutes = ["/login"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {shouldShowHeader && <Header isLogged={isLogged} />}
      <main>{children}</main>
    </div>
  );
}
