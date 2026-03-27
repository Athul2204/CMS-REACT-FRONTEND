import { useState, useEffect } from "react";

/**
 * Custom hook to animate numbers counting up
 * Usage: const count = useCounter(1000);
 */
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 30); // update every 30ms
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setCount(Math.floor(start));
    }, 30);

    return () => clearInterval(interval);
  }, [end, duration]);

  return count;
};

export default useCounter;