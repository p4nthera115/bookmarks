'use client'

import { useState, useEffect } from 'react';

export default function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 99) {
          clearInterval(interval);
          setTimeout(() => onLoaded(), 1200);
          return 100;
        }

        const baseIncrement = 5;
        const dynamicIncrement = baseIncrement + Math.random() * (10 - baseIncrement);

        return Math.min(prevProgress + dynamicIncrement, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-white z-50 flex-row gap-[17px] ${progress !== 100 ? "opacity-100" : "delay-700 opacity-0"} transition-opacity duration-1000`}>
      {[...Array(10)].map((_, index) => {
        const divOpacity = index < Math.floor((progress / 100) * 10) ? 1 : 0.1;

        return (
          <div
            key={index}
            className={`h-10 w-[1px] bg-black`}
            style={{
              opacity: divOpacity,
              rotate: progress === 100 ? '50deg' : '0deg',
              transition: 'opacity 1s ease-out, rotate 0.4s ease-out 0.5s',
            }}
          />
        );
      })}
    </div>
  );
}