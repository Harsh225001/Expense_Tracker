import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEdit2,
  FiChevronDown,
  FiX,
} from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseCard from '../components/ExpenseCard';
import SearchBar from '../components/SearchBar';
import StatsCard from '../components/StatsCard';
import {
  getTransactions,
  saveTransactions,
} from '../utils/localStorage';
import { showToast } from '../utils/toast';
import { categories, categoryColors } from '../data/categories';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const handleAddTransaction = (transaction) => {
    let updated;
    if (editingTransaction) {
      updated = transactions.map((t) =>
        t.id === editingTransaction.id ? { ...transaction, id: t.id } : t
      );
      showToast('Transaction updated!', 'success');
      setEditingTransaction(null);
    } else {
      updated = [...transactions, { ...transaction, id: Date.now() }];
      showToast('Transaction added!', 'success');
    }
    setTransactions(updated);
    saveTransactions(updated);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
    showToast('Transaction deleted', 'success');
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q)
      );
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    if (filterPayment !== 'All') {
      filtered = filtered.filter((t) => t.paymentType === filterPayment);
    }

    filtered.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'date') {
        valA = new Date(a.date);
        valB = new Date(b.date);
      } else if (sortBy === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, searchQuery, filterCategory, filterPayment, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.category === 'Salary' || t.category === 'Savings')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.category !== 'Salary' && t.category !== 'Savings')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      income,
      expense,
      balance: income - expense,
      count: transactions.length,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.category !== 'Salary' && t.category !== 'Savings') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = labels.map((label) => categoryColors[label] || '#7c3aed');

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          padding: 15,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
          Spendly
        </h1>
        <p className="text-gray-400 text-lg">Spend wisely, track wisely.</p>
        <div className="mt-4 h-1 w-24 mx-auto gradient-bg rounded-full" />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Income" amount={stats.income} type="income" />
        <StatsCard title="Total Expenses" amount={stats.expense} type="expense" />
        <StatsCard title="Balance" amount={stats.balance} type="balance" />
        <StatsCard title="Transactions" amount={stats.count} type="count" />
      </div>

      {/* Add Transaction Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setEditingTransaction(null);
          setShowForm(!showForm);
        }}
        className="gradient-bg-hover w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
      >
        <FiPlus className="text-xl" />
        {showForm ? 'Close Form' : 'Add Transaction'}
      </motion.button>

      {/* Expense Form */}
      {showForm && (
        <ExpenseForm
          onSubmit={handleAddTransaction}
          initialData={editingTransaction}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}

      {/* Chart Section */}
      {transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Expense Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="glass rounded-2xl p-4 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field pl-4 pr-10 py-2 rounded-xl appearance-none cursor-pointer text-sm"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Payment Filter */}
          <div className="relative">
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="input-field pl-4 pr-10 py-2 rounded-xl appearance-none cursor-pointer text-sm"
            >
              <option value="All">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="input-field pl-4 pr-10 py-2 rounded-xl appearance-none cursor-pointer text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterCategory !== 'All' || filterPayment !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('All');
                setFilterPayment('All');
              }}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm flex items-center gap-2"
            >
              <FiX /> Clear
            </button>
          )}
        </div>
      </div>

      {/* History Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <div className="text-6xl mb-4">📊</div>
            <h4 className="text-xl font-semibold text-white mb-2">No transactions yet</h4>
            <p className="text-gray-400">
              Start by adding your first transaction to see it here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTransactions.map((transaction, index) => (
              <ExpenseCard
                key={transaction.id}
                transaction={transaction}
                onEdit={() => handleEdit(transaction)}
                onDelete={() => handleDelete(transaction.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;