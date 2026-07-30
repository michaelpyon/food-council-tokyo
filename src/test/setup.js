import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const values = new Map();
const localStorageMock = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: key => values.delete(key),
  clear: () => values.clear(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
});

vi.mock('motion/react', async () => {
  const React = await import('react');

  const motion = new Proxy({}, {
    get: (_, tag) => React.forwardRef(function MotionElement(props, ref) {
      const { children, ...elementProps } = props;
      for (const key of ['layout', 'initial', 'animate', 'exit', 'transition']) {
        delete elementProps[key];
      }
      return React.createElement(tag, { ...elementProps, ref }, children);
    }),
  });

  return {
    motion,
    AnimatePresence: ({ children }) => children,
  };
});
