import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Ban, CheckCircle, Search } from 'lucide-react';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/all');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    const reason = prompt('Enter reason for suspension:');
    if (!reason) return;

    try {
      await axiosInstance.put(`/admin/users/${userId}`, {
        action: 'suspend',
        reason,
      });
      toast.success('User suspended');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await axiosInstance.put(`/admin/users/${userId}`, {
        action: 'delete',
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-text mb-2">User Management</h1>
        <p className="text-text-secondary">Total users: {users.length}</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-text placeholder-text-secondary focus:border-primary focus:outline-none transition"
        />
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Card className="p-0">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-text">Name</th>
                    <th className="text-left p-4 font-semibold text-text">Email</th>
                    <th className="text-left p-4 font-semibold text-text">Role</th>
                    <th className="text-left p-4 font-semibold text-text">Status</th>
                    <th className="text-left p-4 font-semibold text-text">Joined</th>
                    <th className="text-right p-4 font-semibold text-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-border hover:bg-border/30 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.firstName.charAt(0)}
                          </div>
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary">{user.email}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-full">
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-2 text-sm ${user.isActive ? 'text-success' : 'text-danger'}`}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: user.isActive ? '#10B981' : '#EF4444' }}></span>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuspend(user._id)}
                            className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-lg transition"
                          >
                            <Ban size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminUsers;