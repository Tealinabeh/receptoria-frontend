import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

export function Header() {
  const { state, logout } = useAuth();
  const { isAuthenticated, user } = state;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="fixed top-0 w-full flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow-md z-50">
      <Link to="/" className="text-4xl font-semibold text-orange-400">
        Receptoria
      </Link>
      <div className="flex space-x-4 md:space-x-6 items-center">
        <Link to="/" className="text-xl text-gray-700 hover:text-orange-400">
          <span className="md:hidden"><HomeIcon /></span>
          <span className="hidden md:inline">Головна</span>
        </Link>

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 cursor-pointer">
              <img
                src={user?.avatarUrl || '/User.png'}
                alt="Аватар"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              />
              <span className="hidden md:inline font-medium text-gray-700">{user?.nickname}</span>
            </button>
            <div
              className={`absolute right-0 top-full pt-2 w-48 origin-top-right transform transition-all ${isMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                }`}
            >
              <div className="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <Link
                  to={`/user/${user?.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Профіль
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Вийти
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Увійти
          </Link>
        )}
      </div>
    </header>
  );
}