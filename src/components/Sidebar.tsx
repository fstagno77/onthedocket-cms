'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icons } from './Icons';

interface SidebarProps {
  activeSection?: 'timeline' | 'archive' | 'create' | 'edit';
  onNavigate?: (section: 'timeline' | 'archive' | 'create' | 'edit') => void;
}

export default function Sidebar({ activeSection = 'timeline', onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      id: 'timeline',
      label: 'Upcoming Content',
      icon: Icons.Calendar,
      href: '#timeline'
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Icons.Archive,
      href: '#archive'
    },
    {
      id: 'create',
      label: 'New Content',
      icon: Icons.Plus,
      href: '#create'
    },
  ];

  return (
    <>
      {/* Toggle Button (mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-40 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
      >
        <Icons.Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white transition-transform lg:translate-x-0 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="relative h-12 w-full">
              <Image
                src="/on_the_docket_full_white.png"
                alt="On The Docket"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate?.(item.id as 'timeline' | 'archive' | 'create' | 'edit');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <p className="text-xs text-slate-400">Supreme Court Content</p>
            <p className="text-xs text-slate-500">v0.2.0</p>
          </div>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
