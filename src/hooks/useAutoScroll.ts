import { useState, useRef, useEffect, useCallback } from 'react';

export function useAutoScroll(initialSpeed = 2) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isScrollingRef = useRef(false);
  const speedRef = useRef(initialSpeed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const step = useCallback((time: number) => {
    if (!isScrollingRef.current) return;

    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }

    const elapsed = time - lastTimeRef.current;
    if (elapsed > 16) {
      // ~60fps step
      lastTimeRef.current = time;
      const scrollStep = speedRef.current * 0.7; // smooth pixels per frame
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (window.scrollY >= maxScroll - 4) {
        // Reached end of page
        isScrollingRef.current = false;
        setIsScrolling(false);
        return;
      }

      window.scrollBy({ top: scrollStep, behavior: 'auto' });
    }

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(() => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;
    setIsScrolling(true);
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(step);
  }, [step]);

  const pause = useCallback(() => {
    isScrollingRef.current = false;
    setIsScrolling(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    if (isScrollingRef.current) {
      pause();
    } else {
      start();
    }
  }, [pause, start]);

  const changeSpeed = useCallback((newSpeed: number) => {
    const clamped = Math.max(1, Math.min(6, newSpeed));
    setSpeed(clamped);
    speedRef.current = clamped;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isScrollingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isScrolling,
    speed,
    start,
    pause,
    toggle,
    changeSpeed,
  };
}
