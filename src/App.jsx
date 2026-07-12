import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { getCurrentUser, logoutUser, getTheme, saveTheme } from './utils/localStorage';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    const savedTheme = getTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);
    setLoading(false);
  }, []);

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.body.style.background = '#f8fafc';
      document.body.style.color = '#1e293b';
    } else {
      document.documentElement.classList.remove('light-mode');
      document.body.style.background = '#000000';
      document.body.style.color = '#ffffff';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl font-bold gradient-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-black">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col">
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            user={user}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-expense" element={<HomePage />} />
                <Route path="/history" element={<HomePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;