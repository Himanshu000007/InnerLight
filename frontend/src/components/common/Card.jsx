import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-card border border-border rounded-xl p-6 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;