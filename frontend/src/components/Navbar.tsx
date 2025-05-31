import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/auth");
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 30) {
        // Scroll down
        setIsScrollingDown(true);
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scroll up
        setIsScrollingDown(false);
        setShowNavbar(true);
      }

      // Clear previous timeout and set a new one
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrollingDown(false);
      }, 200);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 
        bg-transparent
        transition-all duration-300 ease-in-out
        ${showNavbar ? 'translate-y-0' : '-translate-y-full'}
        ${isScrollingDown ? 'opacity-70' : 'opacity-100'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link
              to="/home"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img
                src="/Vozzi_Logo.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Links */}
          {isLoggedIn && (
            <div className="hidden sm:flex space-x-6 items-center">
              <Link to="/service-dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
              <Link to="/service-calendar" className="hover:text-blue-600 transition">Calendar</Link>
              <Link to="/service-list" className="hover:text-blue-600 transition">Services</Link>
              <Link to="/vehicle-list" className="hover:text-blue-600 transition">Vehicles</Link>
              <Link to="/client-list" className="hover:text-blue-600 transition">Clients</Link>
              <Link to="/add-service-task" className="hover:text-blue-600 transition">Add Task</Link>
            </div>
          )}

          {/* Right: Auth */}
          <div>
            {!isLoggedIn ? (
              <Link
                to="/auth"
                className="inline-block bg-white hover:bg-white hover:scale-105 text-blue-600 px-4 py-2 rounded-full text-sm transition-colors"
              >
                Login / Register
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;