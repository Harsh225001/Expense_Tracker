import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';
import { categoryColors } from '../data/categories';

const ExpenseCard = ({ transaction, onEdit, onDelete, index }) => {
  const categoryColor = categoryColors[transaction.category] || '#7c3aed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass rounded-2xl p-5 card-hover relative overflow-hidden group"
    >
      {/* Gradient Accent */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg mb-1">
            {transaction.title}
          </h4>
          {transaction.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {transaction.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <span
          className="text-2xl font-bold"
          style={{ color: categoryColor }}
        >
          ₹{Number(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span
            className="category-badge"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              border: `1px solid ${categoryColor}40`,
            }}
          >
            {transaction.category}
          </span>
        </div>

        {/* Payment Type */}
        <div className="flex items-center gap-2 text-gray-400">
          <FiCreditCard className="text-xs" />
          <span>{transaction.paymentType}</span>
        </div>

        {/* Location */}
        {transaction.location && (
          <div className="flex items-center gap-2 text-gray-400 col-span-2">
            <FiMapPin className="text-xs" />
            <span className="truncate">{transaction.location}</span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-gray-400 col-span-2">
          <FiCalendar className="text-xs" />
          <span>
            {new Date(transaction.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;