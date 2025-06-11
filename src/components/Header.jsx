import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Header() {
  const { state, logout } = useAuth();
  const { isAuthenticated, user } = state;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full flex items-center justify-between px-6 py-3 bg-white shadow-md z-50">
      <Link to="/" className="text-4xl font-semibold text-orange-400">
        Receptoria
      </Link>
      <div className="flex space-x-6 items-center">
        <Link to="/" className="text-xl text-gray-700 hover:text-orange-400">Головна</Link>
        {isAuthenticated ? (
          <div className="relative group">
            <Link to={`/user/${user?.id}`} className="flex items-center space-x-2 cursor-pointer">
              <img
                src={user?.avatarUrl || '/User.png'}
                alt="Аватар"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              />
              <span className="font-medium text-gray-700 group-hover:text-orange-400">{user?.nickname}</span>
            </Link>
            <div className="absolute right-0 top-full pt-2 w-48 origin-top-right transform opacity-0 scale-95 transition-all invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
              <div className="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <Link to={`/user/${user?.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Профіль</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Вийти</button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Увійти</Link>
        )}
      </div>
    </header>
  );
}