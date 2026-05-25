'use client';

export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageTransition = {
  duration: 0.25,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const containerVariants = {
  animate: { transition: { staggerChildren: 0.07 } },
};

export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const cardHover = {
  whileHover: { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
  transition: { duration: 0.2 },
};

export const floatingCard = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};
