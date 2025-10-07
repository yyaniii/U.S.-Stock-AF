import React from 'react';

interface AvatarProps {
  name: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 40 }) => {
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  const getColors = (seed: string) => {
    const hash = hashCode(seed);
    const colors = [
      ['#fca5a5', '#ef4444'], // red
      ['#fdba74', '#f97316'], // orange
      ['#fde047', '#eab308'], // yellow
      ['#86efac', '#22c55e'], // green
      ['#67e8f9', '#06b6d4'], // cyan
      ['#93c5fd', '#3b82f6'], // blue
      ['#c4b5fd', '#8b5cf6'], // violet
      ['#f9a8d4', '#ec4899'], // pink
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const [color1, color2] = getColors(name);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-full"
    >
      <defs>
        <linearGradient id={`grad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color1, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: color2, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#grad-${name})`} />
    </svg>
  );
};

export default Avatar;