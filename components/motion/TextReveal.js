'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function TextReveal({
  text,
  className = '',
  as = 'h2',
  once = true,
  wordDelay = 0.04,
  charMode = false,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const words = text.split(' ');
  const Tag = as;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: wordDelay, delayChildren: 0.1 },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <Tag ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}>
      <motion.span
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordVariant} style={{ display: 'inline-block' }}>
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
