import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/common/Card';

const AdminModeration = () => {
  const [posts, setPosts] = useState([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-text">Content Moderation</h1>
        <p className="text-text-secondary">Review and moderate community content</p>
      </motion.div>

      {/* Moderation Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <div className="flex items-start gap-4">
            <Shield size={32} className="text-primary flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-text mb-2">Moderation Guidelines</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>✓ Remove content violating community guidelines</li>
                <li>✓ Warn users for policy violations</li>
                <li>✓ Suspend accounts for repeated violations</li>
                <li>✓ Document all moderation actions</li>
                <li>✓ Maintain community safety and health</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Moderation Queue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="text-center py-12">
          <Eye size={48} className="mx-auto text-text-secondary mb-4 opacity-50" />
          <p className="text-text-secondary mb-4">Moderation queue is currently empty</p>
          <p className="text-xs text-text-secondary">All community content is healthy</p>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminModeration;