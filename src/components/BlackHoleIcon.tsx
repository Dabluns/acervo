import React from 'react';

export function BlackHoleIcon({ 
  className = "w-5 h-5",
  glowColor = "#0085ff"
}: { 
  className?: string;
  glowColor?: string;
}) {
  const maskId = React.useId();
  const glowId = React.useId();

  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Photon Glow */}
      <circle cx="50" cy="50" r="45" fill={`url(#${glowId})`} className="animate-pulse opacity-60" />

      <mask id={maskId}>
        {/* Base fill */}
        <rect width="100" height="100" fill="white" />
        
        {/* Cutout: Central Circle Line */}
        <circle 
          cx="50" 
          cy="50" 
          r="18" 
          fill="none" 
          stroke="black" 
          strokeWidth="6.5" 
        />
        
        {/* Cutout: Diagonal Slash Line */}
        <line 
          x1="23" 
          y1="77" 
          x2="77" 
          y2="23" 
          stroke="black" 
          strokeWidth="6.5" 
          strokeLinecap="round" 
        />
      </mask>

      {/* Main Tilted Ellipse Ring / Planet Body */}
      <ellipse 
        cx="50" 
        cy="50" 
        rx="45" 
        ry="22" 
        transform="rotate(-38 50 50)" 
        fill="currentColor" 
        mask={`url(#${maskId})`} 
      />
    </svg>
  );
}
