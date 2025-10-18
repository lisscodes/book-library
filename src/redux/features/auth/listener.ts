import { supabase } from "../../../services/supabaseClient";
import { setSession, setLoading, setError, signOutSuccess } from "./slice";
import type { AppDispatch } from "../../store";

export const initAuthListener = (dispatch: AppDispatch) => {
  // Recupera a sessão ativa assim que o app inicia
  supabase.auth
    .getSession()
    .then(({ data, error }) => {
      if (error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setSession(data.session));
      }
      dispatch(setLoading(false));
    })
    .catch((err) => {
      dispatch(setError(err.message));
      dispatch(setLoading(false));
    });

  // Escuta login, logout e refresh de sessão
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    switch (event) {
      case "SIGNED_IN":
      case "TOKEN_REFRESHED":
        dispatch(setSession(session));
        break;
      case "SIGNED_OUT":
        dispatch(signOutSuccess());
        break;
      default:
        dispatch(setSession(session));
        break;
    }
  });

  // Retorna unsubscribe para ser usado se precisar desmontar
  return () => subscription.unsubscribe();
};
