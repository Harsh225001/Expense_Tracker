import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiMoon,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiSave,
} from 'react-icons/fi';
import { getSettings, saveSettings, clearAllData } from '../utils/localStorage';
import { showToast } from '../utils/toast';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    currency: 'INR',
    theme: 'dark',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    saveSettings(settings);
    showToast('Settings saved successfully!', 'success');
    setLoading(false);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
      clearAllData();
      showToast('All transactions cleared', 'success');
      window.location.reload();
    }
  };

  const handleExport = () => {
    const transactions = JSON.parse(localStorage.getItem('expense_tracker_transactions') || '[]');
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          localStorage.setItem('expense_tracker_transactions', JSON.stringify(data));
          showToast('Data imported successfully!', 'success');
          window.location.reload();
        } catch {
          showToast('Invalid file format', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-gray-400">Customize your experience</p>
      </motion.div>

      <div className="space-y-6">
        {/* Currency Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiDollarSign /> Currency
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="input-field w-full px-4 py-3 rounded-xl appearance-none cursor-pointer"
              >
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="GBP">£ British Pound (GBP)</option>
                <option value="JPY">¥ Japanese Yen (JPY)</option>
              </select>
            </div>
          </form>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiMoon /> Theme
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-gray-400 text-sm">Currently active</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Data Management</h3>
          <div className="space-y-3">
            {/* Export */}
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <FiDownload className="text-primary text-xl" />
              <div>
                <p className="text-white font-medium">Export Data</p>
                <p className="text-gray-400 text-sm">Download all transactions as JSON</p>
              </div>
            </button>

            {/* Import */}
            <label className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <FiUpload className="text-primary text-xl" />
              <div>
                <p className="text-white font-medium">Import Data</p>
                <p className="text-gray-400 text-sm">Restore from JSON backup</p>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {/* Clear All */}
            <button
              onClick={handleClearAll}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-left"
            >
              <FiTrash2 className="text-red-400 text-xl" />
              <div>
                <p className="text-red-400 font-medium">Clear All Data</p>
                <p className="text-gray-400 text-sm">Delete all transactions permanently</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className="gradient-bg-hover w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FiSave />
          {loading ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </div>
  );
};

export default SettingsPage;