import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiPlusCircle,
  FiClock,
  FiBarChart2,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/add-expense', icon: FiPlusCircle, label: 'Add Expense' },
    { path: '/history', icon: FiClock, label: 'History' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg glass lg:hidden"
      >
        <FiMenu className="text-white text-xl" />
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen glass border-r border-border z-40 hidden lg:flex flex-col overflow-hidden"
      >
        {/* Logo */}
        {isOpen && (
          <div className="p-4 flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold gradient-text truncate"
            >
             Spendly
            </motion.h1>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <FiMenu className="text-white text-lg" />
            </button>
          </div>
        )}

        {/* Menu Items */}
        {isOpen && (
          <nav className="flex-1 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              );
            })}
          </nav>
        )}

        {/* Logout Button */}
        {isOpen && (
          <div className="p-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
            >
              <FiLogOut className="text-lg flex-shrink-0" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm"
              >
                Logout
              </motion.span>
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;