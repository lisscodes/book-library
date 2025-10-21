import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../services/authService";
import { setSession, setLoading, setError } from "../redux/features/auth/slice";
import { Eye, EyeOff, X } from "lucide-react";
import logo from "../assets/logo.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const data = isSignup
        ? await signUp(email, password)
        : await signIn(email, password);
      dispatch(setSession(data.session ?? null));
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <img
          src={logo}
          alt="Book Library Logo"
          className="w-24 h-24 mb-6 object-contain"
        />

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            {email && (
              <button
                type="button"
                onClick={() => setEmail("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                aria-label="Limpar campo de email"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              aria-label="Mostrar ou ocultar senha"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded-full mt-2 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 transition"
          >
            {isSignup ? "Sign up" : "Log in"}
          </button>

          {!isSignup && (
            <button
              type="button"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgotten password?
            </button>
          )}
        </form>

        <p className="text-sm text-gray-700 mt-6">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-purple-600 hover:underline"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don’t have an account yet?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-purple-600 hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
