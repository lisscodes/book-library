import { signOut } from "../../../services/authService";
import { setLoading, setError, signOutSuccess } from "./slice";
import type { AppDispatch } from "../../store";

export const handleSignOut =
  () => async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setLoading(true));
      await signOut();
      dispatch(signOutSuccess());
      dispatch(setError(null));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[AuthThunk] signOut error:", error.message);
      dispatch(setError("Erro ao encerrar sessão."));
    } finally {
      dispatch(setLoading(false));
    }
  };
