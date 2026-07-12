import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiCamera, FiSave } from 'react-icons/fi';
import { getProfile, saveProfile } from '../utils/localStorage';
import { showToast } from '../utils/toast';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    saveProfile(profile);
    showToast('Profile saved successfully!', 'success');
    setLoading(false);
  };

  const handleAvatarChange = () => {
    const url = prompt('Enter avatar URL:');
    if (url) {
      setProfile((prev) => ({ ...prev, avatar: url }));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name ? profile.name[0].toUpperCase() : 'U'}
                </div>
              )}
              <button
                type="button"
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary/80 transition-colors"
              >
                <FiCamera />
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="input-field w-full pl-10 pr-4 py-3 rounded-xl"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="input-field w-full pl-10 pr-4 py-3 rounded-xl"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="input-field w-full pl-10 pr-4 py-3 rounded-xl"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="gradient-bg-hover w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiSave />
            {loading ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;