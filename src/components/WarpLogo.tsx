import React from 'react';

type WarpLogoProps = {
  className?: string;
  classNamePath?: string;
};

export function WarpLogo({ className = "w-6 h-6" }: WarpLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/acervoaki-mark.png" alt="" className={`${className} object-contain`} />
  );
}
