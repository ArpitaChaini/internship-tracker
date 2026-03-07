import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/api';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FiBriefcase, FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const STATUS_COLORS_MAP = {
  Applied: '#6366f1',
  Shortlisted: '#eab308',
  Interview: '#a855f7',
  Rejected: '#ef4444',
  Offer: '#22c55e',
};

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to || '#'} className="group glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-slate-400">{label}</p>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getCount = (status) => {
    if (!stats) return 0;
    const found = stats.statusCounts.find((s) => s.application_status === status);
    return found ? found.count : 0;
  };

  const donutData = {
    labels: Object.keys(STATUS_COLORS_MAP),
    datasets: [{
      data: Object.keys(STATUS_COLORS_MAP).map(getCount),
      backgroundColor: Object.values(STATUS_COLORS_MAP).map(c => c + '99'),
      borderColor: Object.values(STATUS_COLORS_MAP),
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: stats?.monthlyCount?.map((r) => r.month) || [],
    datasets: [{
      label: 'Applications',
      data: stats?.monthlyCount?.map((r) => r.count) || [],
      backgroundColor: '#6366f199',
      borderColor: '#6366f1',
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#ffffff10' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#ffffff10' } },
    },
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's an overview of your internship journey</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiBriefcase} label="Total Applications" value={stats?.total || 0} color="bg-indigo-600" to="/applications" />
          <StatCard icon={FiMessageSquare} label="Interviews" value={getCount('Interview')} color="bg-purple-600" to="/applications?status=Interview" />
          <StatCard icon={FiCheckCircle} label="Offers Received" value={getCount('Offer')} color="bg-green-600" to="/applications?status=Offer" />
          <StatCard icon={FiXCircle} label="Rejected" value={getCount('Rejected')} color="bg-red-600" to="/applications?status=Rejected" />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Applications by Status</h3>
          {!loading && (
            <div className="max-w-xs mx-auto">
              <Doughnut data={donutData} options={{ plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
            </div>
          )}
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Applications per Month</h3>
          {!loading && (
            <Bar data={barData} options={chartOptions} />
          )}
          {!loading && stats?.monthlyCount?.length === 0 && (
            <p className="text-slate-500 text-center py-12">No application data yet.</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/applications/add"
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/25"
        >
          + Add Application
        </Link>
        <Link
          to="/notes"
          className="px-5 py-2.5 glass border border-white/10 text-slate-300 text-sm font-medium rounded-xl hover:bg-white/10 transition-all duration-200"
        >
          Interview Notes
        </Link>
        <Link
          to="/resumes"
          className="px-5 py-2.5 glass border border-white/10 text-slate-300 text-sm font-medium rounded-xl hover:bg-white/10 transition-all duration-200"
        >
          Manage Resumes
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
