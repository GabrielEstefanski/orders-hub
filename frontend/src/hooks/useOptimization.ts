import { useMemo, useCallback, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

const formatValue = (value: number): string => {
  return value.toLocaleString('pt-BR');
};

export function useChartMemo<T extends { value: number }>(data: T[], dependencies: any[]) {
  return useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedValue: formatValue(item.value)
    }));
  }, dependencies);
}

export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const debouncedCallback = useCallback(
    debounce((...args: Parameters<T>) => callback(...args), delay),
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      (debouncedCallback as any).cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

export function useCompareWithPrevious<T>(
  currentValue: T,
  compareFunction: (prev: T | undefined, current: T) => number
): number {
  const previousValue = usePrevious(currentValue);
  
  return useMemo(() => {
    return compareFunction(previousValue, currentValue);
  }, [previousValue, currentValue, compareFunction]);
}

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const lastRun = useRef<number>(Date.now());
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - (now - lastRun.current));
      }
    },
    [callback, delay]
  );
} 
