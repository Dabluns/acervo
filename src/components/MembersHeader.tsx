'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WarpLogo } from '@/components/WarpLogo';
import { LogoutButton } from '@/components/LogoutButton';

export function MembersHeader({ name, email }: { name: string; email: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || 'M';

  return (
    <div className="w-full p-6 flex justify-between items-center z-50 border-b border-white/5 bg-[#010003]/80 backdrop-blur-md relative">
      <Link href="/" className="flex items-center gap-3 group">
        <WarpLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
        <span className="font-headline text-2xl font-bold tracking-widest text-white mt-1">
          <span className="text-white">ACERVO</span><span className="text-blue-500">AKI</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-sm font-bold text-white">{name}</span>
          <span className="text-xs text-white/50 font-mono">{email}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center font-bold text-white">
          {initial}
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
