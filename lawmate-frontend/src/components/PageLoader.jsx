import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);

  // Trigger on route change
  useEffect(() => {
    setLoading(true);
    setWidth(0);

    // Simulate page load progress
    const t1 = setTimeout(() => setWidth(30), 50);
    const t2 = setTimeout(() => setWidth(60), 100);
    const t3 = setTimeout(() => setWidth(80), 300);
    
    // Auto-complete the bar after a short duration
    const t4 = setTimeout(() => {
      setWidth(100);
    }, 600);

    const t5 = setTimeout(() => {
      setLoading(false);
      setWidth(0);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [location.pathname]);

  if (!loading && width === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${width}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #6366f1, #818cf8)',
        transition: width === 100 ? 'width 0.2s ease' : 'width 0.4s ease',
        zIndex: 9999,
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 8px #6366f1aa',
      }}
    />
  );
}
