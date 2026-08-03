import { MotionConfig } from 'motion/react';

export default function AppProviders({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
