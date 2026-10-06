'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WarpLogo } from '@/components/WarpLogo';
import { LogoutButton } from '@/components/LogoutButton';

export function MembersHeader({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const initial = name.trim().charAt(0).toUpperCase() || 'M';

  return (
    <div className="w-full p-6 flex justify-between items-center z-50 border-b border-white/5 bg-[#010003]/80 backdrop-blur-md relative">
      <div className="flex items-center gap-3">
        <WarpLogo className="w-8 h-8" classNamePath="text-warp-400" />
        <span className="font-headline text-2xl tracking-widest text-white mt-1">
          <span className="text-white">WARP</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-full absolute left-1/2 -translate-x-1/2">
        <Link
          href="/warp-tools"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${pathname === '/warp-tools' ? 'bg-warp-500/20 text-warp-300 border border-warp-500/30' : 'text-white/50 hover:text-white border border-transparent'}`}
        >
          Terminal
        </Link>
        <Link 
          href="/acervo" 
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${pathname === '/acervo' ? 'bg-warp-500/20 text-warp-300 border border-warp-500/30' : 'text-white/50 hover:text-white border border-transparent'}`}
        >
          Acervo VIP
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-sm font-bold text-white">{name}</span>
          <span className="text-xs text-white/50 font-mono">{email}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-warp-900/50 border border-warp-500/30 flex items-center justify-center font-bold text-white">
          {initial}
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
