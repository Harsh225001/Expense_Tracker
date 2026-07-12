import { FiMenu, FiBell, FiSearch, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = ({ onToggleSidebar, user, theme, onToggleTheme }) => {
  return (
    <nav className="glass border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <FiMenu className="text-white text-xl" />
        </button>
        <h2 className="text-xl font-semibold text-white hidden sm:block">
          Welcome, {user?.fullName || user?.username || 'User'}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Icon */}
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
          <FiSearch className="text-gray-400 text-xl" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
          <FiBell className="text-gray-400 text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <FiSun className="text-yellow-400 text-xl" />
          ) : (
            <FiMoon className="text-primary text-xl" />
          )}
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
          {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
