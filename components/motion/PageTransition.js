'use client';

import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
