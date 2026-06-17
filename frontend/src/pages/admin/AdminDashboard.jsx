import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: AlertTriangle,
      label: 'Pending Reports',
      value: stats?.pendingReports || 0,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: MessageSquare,
      label: 'Unread Contacts',
      value: stats?.unreadContacts || 0,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      label: 'Platform Health',
      value: '98%',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-text">Admin Dashboard</h1>
        <p className="text-text-secondary">Manage platform, users, and reports</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-text">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer">
          <Users size={40} className="mx-auto text-primary mb-3" />
          <h3 className="text-lg font-semibold text-text mb-2">Manage Users</h3>
          <p className="text-text-secondary text-sm mb-4">View and manage user accounts</p>
          <a href="/admin/users" className="text-primary hover:text-secondary font-semibold text-sm">
            Go to Users →
          </a>
        </Card>

        <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer">
          <AlertTriangle size={40} className="mx-auto text-orange-500 mb-3" />
          <h3 className="text-lg font-semibold text-text mb-2">Review Reports</h3>
          <p className="text-text-secondary text-sm mb-4">Handle community reports</p>
          <a href="/admin/reports" className="text-primary hover:text-secondary font-semibold text-sm">
            Go to Reports →
          </a>
        </Card>

        <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer">
          <MessageSquare size={40} className="mx-auto text-purple-500 mb-3" />
          <h3 className="text-lg font-semibold text-text mb-2">Moderation</h3>
          <p className="text-text-secondary text-sm mb-4">Moderate content and posts</p>
          <a href="/admin/moderation" className="text-primary hover:text-secondary font-semibold text-sm">
            Go to Moderation →
          </a>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;