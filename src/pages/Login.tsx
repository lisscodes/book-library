import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../services/authService";
import { setSession, setLoading, setError } from "../redux/features/auth/slice";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-blue-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* Ícone do livro */}
        <div className="w-20 h-20 mb-6 flex items-center justify-center bg-blue-100 rounded-full">
          <span className="text-4xl">📘</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="User name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {email && (
              <button
                type="button"
                onClick={() => setEmail("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✖️
              </button>
            )}
          </div>

          {/* Senha */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Botão Login */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-full mt-2 hover:bg-blue-700 transition"
          >
            {isSignup ? "Sign up" : "Log in"}
          </button>

          {/* Links adicionais */}
          {!isSignup && (
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgotten password?
            </button>
          )}
        </form>

        {/* Login social */}
        <div className="flex flex-col items-center mt-6 space-y-3 w-full">
          <p className="text-gray-600 text-sm">- Or sign in with -</p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5" />
            </button>
            <button className="bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" className="w-5 h-5" />
            </button>
            <button className="bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg" alt="Twitter" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alternar cadastro/login */}
        <p className="text-sm text-gray-700 mt-6">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don’t have an account yet?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-blue-600 hover:underline"
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
