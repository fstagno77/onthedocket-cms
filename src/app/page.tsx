'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/src/components/Sidebar';
import Timeline from '@/src/components/Timeline';
import Archive from '@/src/components/Archive';
import CreateContent from '@/src/components/CreateContent';
import EditContent from '@/src/components/EditContent';

export default function Home() {
  const [activeSection, setActiveSection] = useState<'timeline' | 'archive' | 'create' | 'edit'>('timeline');
  const [contents, setContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<any | null>(null);

  useEffect(() => {
    const loadContents = async () => {
      try {
        const response = await fetch('/api/contents');
        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error('Failed to load contents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContents();
  }, []);

  const handleContentCreated = async () => {
    try {
      const response = await fetch('/api/contents');
      const updatedContents = await response.json();
      setContents(updatedContents);
      setActiveSection('timeline');
    } catch (error) {
      console.error('Failed to refresh contents:', error);
    }
  };

  const handleEditClick = (index: number, content: any) => {
    setEditingIndex(index);
    setEditingContent(content);
    setActiveSection('edit');
  };

  const handleDeleteClick = async (index: number) => {
    try {
      const response = await fetch('/api/contents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });

      if (!response.ok) throw new Error('Delete error');

      const updatedContents = await fetch('/api/contents').then(r => r.json());
      setContents(updatedContents);
      setActiveSection('timeline');
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Error deleting content');
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditingContent(null);
    setActiveSection('timeline');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  On The Docket
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">Content Manager & Publishing Hub</p>
              </div>
              <div className="text-right text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{contents.length}</p>
                <p className="text-xs">total content</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {activeSection === 'timeline' && (
            <section id="timeline">
              <Timeline contents={contents} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
            </section>
          )}

          {activeSection === 'archive' && (
            <section id="archive">
              <Archive contents={contents} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
            </section>
          )}

          {activeSection === 'create' && (
            <section id="create">
              <CreateContent onContentCreated={handleContentCreated} />
            </section>
          )}

          {activeSection === 'edit' && editingContent && editingIndex !== null && (
            <section id="edit">
              <EditContent
                content={editingContent}
                contentIndex={editingIndex}
                onContentUpdated={handleContentCreated}
                onCancel={handleEditCancel}
              />
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm">
            <p>
              On The Docket © 2026 | Content Management System v0.2.0
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
