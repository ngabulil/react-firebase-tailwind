import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./components/PublicRoutes";
import {
  artikel,
  dashboard,
  login,
  pengaduan,
  resetPassword,
  statistik,
  umkm,
} from "./constant/routes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import UMKM from "./pages/UMKM";
import Pengaduan from "./pages/Pengaduan";
import Statistik from "./pages/Statistik";
import PrivateRoutes from "./components/PrivateRoutes";
import Artikel from "./pages/Artikel";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRoutes />,
      children: [
        {
          path: dashboard,
          element: <Dashboard />,
        },
        {
          path: umkm,
          element: <UMKM />,
        },
        {
          path: pengaduan,
          element: <Pengaduan />,
        },
        {
          path: statistik,
          element: <Statistik />,
        },
        {
          path: artikel,
          element: <Artikel />,
        }
      ],
    },
    {
      element: <PublicRoutes />,
      children: [
        {
          path: login,
          element: <Login />,
        },
        {
          path: resetPassword,
          element: <ResetPassword />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
