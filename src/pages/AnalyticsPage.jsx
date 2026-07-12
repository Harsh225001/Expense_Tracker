import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
  FiBarChart2,
  FiActivity,
} from 'react-icons/fi';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import StatsCard from '../components/StatsCard';
import { getTransactions } from '../utils/localStorage';
import { categoryColors } from '../data/categories';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const AnalyticsPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.category === 'Salary' || t.category === 'Savings')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.category !== 'Salary' && t.category !== 'Savings')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const savings = income > 0 ? ((income - expense) / income) * 100 : 0;

    const now = new Date();
    const monthlyExpense = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear() &&
          t.category !== 'Salary' &&
          t.category !== 'Savings'
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyExpense = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return d >= weekAgo && t.category !== 'Salary' && t.category !== 'Savings';
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
      savings,
      monthlyExpense,
      weeklyExpense,
    };
  }, [transactions]);

  const pieData = useMemo(() => {
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
        },
      ],
    };
  }, [transactions]);

  const barData = useMemo(() => {
    const monthlyData = {};
    transactions.forEach((t) => {
      if (t.category !== 'Salary' && t.category !== 'Savings') {
        const month = new Date(t.date).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        monthlyData[month] = (monthlyData[month] || 0) + Number(t.amount);
      }
    });

    const labels = Object.keys(monthlyData).slice(-6);
    const data = labels.map((label) => monthlyData[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Expenses',
          data,
          backgroundColor: '#7c3aed',
        },
      ],
    };
  }, [transactions]);

  const lineData = useMemo(() => {
    const dailyData = {};
    const sorted = [...transactions]
      .filter((t) => t.category !== 'Salary' && t.category !== 'Savings')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach((t) => {
      const day = new Date(t.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      dailyData[day] = (dailyData[day] || 0) + Number(t.amount);
    });

    const labels = Object.keys(dailyData).slice(-10);
    const data = labels.map((label) => dailyData[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Expenses',
          data,
          borderColor: '#ff4d94',
          backgroundColor: 'rgba(255, 77, 148, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics</h1>
        <p className="text-gray-400">Detailed insights into your spending</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Income" amount={stats.income} type="income" />
        <StatsCard title="Total Expense" amount={stats.expense} type="expense" />
        <StatsCard title="Balance" amount={stats.balance} type="balance" />
        <StatsCard title="Savings %" amount={`${stats.savings.toFixed(1)}%`} type="balance" />
        <StatsCard title="Monthly Expense" amount={stats.monthlyExpense} type="expense" />
        <StatsCard title="Weekly Expense" amount={stats.weeklyExpense} type="expense" />
      </div>

      {/* Charts */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiPieChart /> Category Breakdown
            </h3>
            <div className="h-64">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiBarChart2 /> Monthly Expenses
            </h3>
            <div className="h-64">
              <Bar data={barData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiActivity /> Expense Trend
            </h3>
            <div className="h-64">
              <Line data={lineData} options={chartOptions} />
            </div>
          </motion.div>
        </div>
      )}

      {transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <div className="text-6xl mb-4">📈</div>
          <h4 className="text-xl font-semibold text-white mb-2">No data to analyze</h4>
          <p className="text-gray-400">Add some transactions to see analytics</p>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;