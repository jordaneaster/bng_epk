'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AnimateOnScroll({
  children,
  variants,
  className = '',
  once = true,
  amount = 0.2,
  as = 'div',
  delay = 0,
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const Component = motion[as] || motion.div;

  const defaultVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants || defaultVariants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
