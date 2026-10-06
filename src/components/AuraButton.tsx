'use client';

import React from 'react';
import { BlackHoleIcon } from './BlackHoleIcon';

interface AuraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  showBlackHole?: boolean;
}

export function AuraButton({
  children,
  icon,
  className = '',
  showBlackHole = true,
  onClick,
  ...props
}: AuraButtonProps) {
  return (
    <div className="btn-wrapper inline-flex group">
      <button
        onClick={onClick}
        type="button"
        className={`btn font-mono text-sm sm:text-base font-medium py-3.5 px-8 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${className}`}
        {...props}
      >
        {icon ? (
          <span className="btn-svg-container transition-all duration-300 group-hover:scale-110 z-10">
            {icon}
          </span>
        ) : showBlackHole ? (
          <span className="btn-svg-container transition-all duration-300 text-warp-400 group-hover:text-warp-300 group-hover:scale-110 z-10">
            <BlackHoleIcon className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
          </span>
        ) : null}
        
        <span className="txt-wrapper relative flex items-center tracking-wide text-white/90 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] z-10">
          {children}
        </span>
      </button>
    </div>
  );
}
