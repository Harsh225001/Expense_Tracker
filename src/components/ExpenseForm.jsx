import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiDollarSign, FiMapPin, FiCalendar } from 'react-icons/fi';
import { categories, paymentTypes } from '../data/categories';

const ExpenseForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    paymentType: 'Cash',
    category: 'Food',
    amount: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        paymentType: initialData.paymentType || 'Cash',
        category: initialData.category || 'Food',
        amount: initialData.amount || '',
        location: initialData.location || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {initialData ? 'Edit Transaction' : 'New Transaction'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <FiX className="text-gray-400 text-xl" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Transaction Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field w-full px-4 py-3 rounded-xl"
              placeholder="Rent, Salary, Groceries..."
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount *
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input-field w-full pl-10 pr-4 py-3 rounded-xl"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Type
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="input-field w-full px-4 py-3 rounded-xl appearance-none cursor-pointer"
            >
              {paymentTypes.map((type) => (
                <option key={type.name} value={type.name}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field w-full px-4 py-3 rounded-xl appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field w-full pl-10 pr-4 py-3 rounded-xl"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field w-full pl-10 pr-4 py-3 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field w-full px-4 py-3 rounded-xl resize-none"
            rows="3"
            placeholder="Add a note..."
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="gradient-bg-hover w-full py-3 rounded-xl font-semibold text-white"
        >
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ExpenseForm;