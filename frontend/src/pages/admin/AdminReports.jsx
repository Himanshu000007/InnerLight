import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/reports', {
        params: { status: filter },
      });
      setReports(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewReport = async (reportId, action) => {
    const adminNotes = prompt('Add notes:');
    if (!adminNotes) return;

    try {
      await axiosInstance.put(`/reports/${reportId}/review`, {
        action,
        adminNotes,
      });
      toast.success('Report reviewed');
      fetchReports();
    } catch (error) {
      toast.error('Failed to review report');
    }
  };

  const statuses = ['pending', 'under_review', 'resolved', 'dismissed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-text mb-2">Reports</h1>
        <p className="text-text-secondary">Review and manage community reports</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 flex-wrap"
      >
        {statuses.map(status => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? 'primary' : 'secondary'}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        ) : reports.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-text-secondary">No reports found</p>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report._id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle size={20} className="text-orange-500" />
                    <h3 className="font-bold text-text">Report #{report._id.slice(-6)}</h3>
                    <span className="px-2 py-1 bg-orange-500 bg-opacity-20 text-orange-500 text-xs rounded-full">
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-3">
                    <span className="font-semibold">Reason:</span> {report.reason}
                  </p>
                  <p className="text-text-secondary text-sm mb-3">
                    {report.description}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Reported by: {report.reporterId?.email}
                  </p>
                </div>

                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReviewReport(report._id, 'warning')}
                      className="bg-orange-500 text-white"
                    >
                      <AlertTriangle size={16} />
                      Warning
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReviewReport(report._id, 'content_removed')}
                      className="bg-danger text-white"
                    >
                      <X size={16} />
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReviewReport(report._id, 'dismissed')}
                      variant="secondary"
                    >
                      <Check size={16} />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default AdminReports;