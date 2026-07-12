import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';

const StatsCard = ({ title, amount, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return FiTrendingUp;
      case 'expense':
        return FiTrendingDown;
      case 'balance':
        return FiDollarSign;
      default:
        return FiActivity;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-400';
      case 'expense':
        return 'text-red-400';
      case 'balance':
        return amount >= 0 ? 'text-green-400' : 'text-red-400';
      default:
        return 'text-primary';
    }
  };

  const Icon = getIcon();
  const colorClass = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl p-5 card-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <Icon className={`text-xl ${colorClass}`} />
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>
        {type === 'count' ? amount : `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
      </div>
    </motion.div>
  );
};

export default StatsCard;