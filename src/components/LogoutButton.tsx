'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-red-500/50 transition-all text-white/70 hover:text-red-400 group"
      title="Sair"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-xs font-bold font-mono tracking-widest uppercase hidden sm:block">Sair</span>
    </button>
  );
}
