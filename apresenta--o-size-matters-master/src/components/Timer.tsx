import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <Clock size={16} className="text-slate-400" />
      <span className="font-mono text-sm font-medium">{formatTime(seconds)} / 20:00</span>
    </div>
  );
}