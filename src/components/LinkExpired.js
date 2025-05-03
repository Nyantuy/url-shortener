'use client';

import { useEffect, useState } from 'react';

export default function LinkExpired() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 5000);

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <div className="flex flex-grow flex-col justify-center items-center">
        <h1 className="text-left text-xl md:text-4xl font-semibold md:font-bold">Link Expired</h1>
        <p className="text-left text-sm md:text-lg">The link you are trying to access already expired.</p>
        <p className="mt-4 text-gray-400 text-sm">
          Redirecting to home page in {seconds} second{seconds > 1 ? 's' : ''}...
        </p>
      </div>
    </div>
  );
}
