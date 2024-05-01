import { NavLink, useNavigate } from "react-router-dom";
import {
  artikel,
  dashboard,
  login,
  pengaduan,
  statistik,
  umkm,
} from "../constant/routes";
import { useAuthContext } from "../context/authContext/useAuthContext";
import { FaUser } from "react-icons/fa";
import { removeToken, removeUid } from "../services/api";

const Sidebar = () => {
  const { auth, resetAuth } = useAuthContext();
  const navigate = useNavigate()
  const listRoute = [
    { name: "Dashboard", path: dashboard },
    { name: "UMKM", path: umkm },
    { name: "Pengaduan", path: pengaduan },
    { name: "Artikel", path: artikel },
    { name: "Statistik", path: statistik },
  ];
  const handleLogout = () => {
    removeToken();
    removeUid();
    resetAuth();
    navigate(login);
  }
  return (
    <div className="h-full bg-gray-900 relative">
      <div className="sidebar h-screen sticky top-0 lg:left-0 p-2 w-[250px] overflow-y-auto text-center">
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
            <h1 className="font-bold text-gray-200 text-[15px] ml-3">
              Dashboard Admin
            </h1>
            <i className="bi bi-x cursor-pointer ml-28 lg:hidden"></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        {listRoute.map((item) => (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `${
                isActive && "bg-blue-600"
              } p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-[15px] text-gray-200 font-bold`
            }
          >
            {item.name}
          </NavLink>
        ))}
        <div className="flex items-center text-white justify-between px-3 gap-14 absolute bottom-3">
          <div>
            <FaUser size={30} fill="white" />
          </div>
          <div>
            <p>{auth?.profile?.email}</p>
            <p className="text-center">Admin</p>
          </div>
          <p onClick={handleLogout} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-red-600 w-full rounded-md py-3 cursor-pointer">Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
