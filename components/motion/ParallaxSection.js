'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
  direction = 'up',
  ...props
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yRange = direction === 'up' ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed];
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }} {...props}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
