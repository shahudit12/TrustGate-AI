/**
 * TrustGate AI — Motion System Tokens
 *
 * Cohesive Framer Motion physics and transition presets.
 */

export const MOTION_TOKENS = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
  },
  ease: {
    standard: [0.2, 0, 0, 1] as const,
    enter: [0, 0, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },
  spring: {
    soft: { type: 'spring' as const, stiffness: 150, damping: 20 },
    medium: { type: 'spring' as const, stiffness: 260, damping: 25 },
    snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
};

export const PAGE_TRANSITION_VARIANTS = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: MOTION_TOKENS.duration.normal, ease: MOTION_TOKENS.ease.enter } },
  exit: { opacity: 0, y: -8, transition: { duration: MOTION_TOKENS.duration.fast, ease: MOTION_TOKENS.ease.exit } },
};

export const STAGGER_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const FADE_UP_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: MOTION_TOKENS.spring.medium },
};
