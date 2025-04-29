import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaPlusSquare, 
  FaClipboardCheck, 
  FaBars, 
  FaPercent, 
  FaAddressBook,
  FaUser,
  FaSignOutAlt 
} from "react-icons/fa";
import { useAuth } from "../../AuthContext";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { path: "/", label: "Percentage", icon: <FaPercent/> },
    { path: "/TodaysSchedule", label: "Today's Schedule", icon: <FaCalendarAlt /> },
    { path: "/AttendanceCard", label: "Mark Attendance", icon: <FaClipboardCheck /> },
    { path: "/ScheduleNew", label: "Schedule New", icon: <FaPlusSquare /> },
  ];

  return (
    <div>
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {!user ? (
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white transition-colors duration-200"
                >
                  <FaAddressBook />
                  <span className="ml-2 text-xl">Log in</span>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white transition-colors duration-200"
                  >
                    <FaUser />
                    <span className="ml-2 text-xl">{user.username}</span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 w-full text-left"
                      >
                        <FaSignOutAlt className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Navigation Items - Desktop */}
            {user && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white transition-colors duration-200"
                      aria-label={item.label}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <FaBars className="block h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && (
          <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white transition-colors duration-200"
                  aria-label={item.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
              
              {/* Logout button in mobile menu */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"></div>
    </div>
  );
};

export default NavigationBar;