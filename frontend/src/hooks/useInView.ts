import { useEffect, useRef } from 'react';
import { useAnimation, useInView as useInViewFromFramer } from 'framer-motion';

export function useInView(threshold = 0.1) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInViewFromFramer(ref, { 
    amount: threshold,
    once: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    } else {
      controls.start('initial');
    }
  }, [controls, inView]);

  return { ref, controls, inView };
}
