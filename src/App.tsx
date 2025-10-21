import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layouts/Layout";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <AppRoutes />
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
