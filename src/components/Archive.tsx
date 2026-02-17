'use client';

import { useState, useMemo } from 'react';
import { formatDate, daysUntil } from '@/src/lib/utils';
import { Icons } from './Icons';

interface Content {
  "File Name"?: string | null;
  "Post Title"?: string | null;
  "Description"?: string | null;
  "Publication Date"?: string | null;
  "Duration"?: string | null;
  "YouTube"?: string | null;
  "TikTok"?: string | null;
  "X.com"?: string | null;
  "Type"?: string | null;
  "Case"?: string | null;
  "SCOTUS Docket no."?: string | null;
}

interface ArchiveProps {
  contents: Content[];
  onEditClick?: (index: number, content: Content) => void;
  onDeleteClick?: (index: number) => void;
}

export default function Archive({ contents, onEditClick, onDeleteClick }: ArchiveProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const published = useMemo(() => {
    return contents
      .map((c, idx) => ({ ...c, originalIdx: idx }))
      .filter(c => {
        const days = daysUntil(c["Publication Date"] || '');
        return days <= 0;
      })
      .sort((a, b) => {
        const dateA = new Date(a["Publication Date"] || '');
        const dateB = new Date(b["Publication Date"] || '');
        let dateCompare = dateB.getTime() - dateA.getTime();

        // Applica ordinamento ascendente/discendente
        if (sortOrder === 'asc') {
          dateCompare = -dateCompare;
        }

        // Se stessa data: Primary prima di Short
        if (dateCompare === 0) {
          const typeA = a["Type"]?.toLowerCase() === 'primary' ? 0 : 1;
          const typeB = b["Type"]?.toLowerCase() === 'primary' ? 0 : 1;
          return typeA - typeB;
        }

        return dateCompare;
      })
      .filter(c => {
        const matchesSearch =
          c["Post Title"]?.toLowerCase().includes(search.toLowerCase()) ||
          c["Case"]?.toLowerCase().includes(search.toLowerCase()) ||
          c["Description"]?.toLowerCase().includes(search.toLowerCase());

        const matchesType = filterType === 'all' || c["Type"] === filterType;

        return matchesSearch && matchesType;
      });
  }, [contents, search, filterType, sortOrder]);

  const types = Array.from(new Set(contents.map(c => c["Type"]).filter(Boolean))) as string[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
          Publications Archive
        </h2>
        <p className="text-slate-600">Access all published content</p>
      </div>

      {/* Search, Sort & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Icons.Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 p-0.5 hover:bg-slate-200 rounded transition-colors"
              title="Clear search"
            >
              <Icons.X className="w-4 h-4 text-slate-600" />
            </button>
          )}
        </div>

        {/* Sort Button */}
        <div className="flex items-center gap-3">
          <Icons.Sort className="w-5 h-5 text-slate-600 flex-shrink-0" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 text-sm"
          >
            <option value="desc">Date: Latest First</option>
            <option value="asc">Date: Earliest First</option>
          </select>
        </div>

        {/* Filter Button */}
        <div className="flex items-center gap-3">
          <Icons.Filter className="w-5 h-5 text-slate-600 flex-shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 text-sm"
          >
            <option value="all">All types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{published.length}</span> {published.length === 1 ? 'publication' : 'publications'} found
        </p>
      </div>

      {/* Content Grid */}
      {published.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-16 text-center">
          <p className="text-slate-500 text-lg">No publications match your filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {published.map((content, idx) => {
            const isExpanded = expandedId === idx;

            return (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all"
              >
                {/* Main Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : idx)}
                  className="w-full p-6 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    {/* Date & Badges */}
                    <div className="flex-shrink-0 w-32">
                      <p className="text-sm text-slate-600 mb-2">
                        {formatDate(content["Publication Date"])}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 flex-1">
                          {content["Post Title"]}
                        </h3>
                        {content["Type"] && (
                          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            content["Type"]?.toLowerCase() === 'primary'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {content["Type"]}
                          </span>
                        )}
                      </div>
                      {content["Case"] && (
                        <p className="text-sm text-slate-600">
                          {content["Case"]}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick?.(content.originalIdx as number, content);
                        }}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Icons.Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this content?')) {
                            onDeleteClick?.(content.originalIdx as number);
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Icons.Trash className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <Icons.ChevronDown
                      className={`flex-shrink-0 w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/50 p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Type</p>
                        <p className="text-slate-900">{content["Type"] || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Duration</p>
                        <p className="text-slate-900">{content["Duration"] || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Docket #</p>
                        <p className="text-slate-900">{content["SCOTUS Docket no."] || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">File</p>
                        <p className="text-slate-900 break-all">{content["File Name"] || '-'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Description</p>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">
                        {content["Description"] || '-'}
                      </p>
                    </div>

                    {(content["YouTube"] || content["TikTok"] || content["X.com"]) && (
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Platform Links</p>
                        <div className="space-y-2">
                          {content["YouTube"] && (
                            <div className="flex items-center gap-2">
                              <Icons.YouTubeOutlined className="w-5 h-5 text-red-600 flex-shrink-0" />
                              <a href={content["YouTube"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                                YouTube
                              </a>
                            </div>
                          )}
                          {content["TikTok"] && (
                            <div className="flex items-center gap-2">
                              <Icons.TikTokOutlined className="w-5 h-5 text-slate-900 flex-shrink-0" />
                              <a href={content["TikTok"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                                TikTok
                              </a>
                            </div>
                          )}
                          {content["X.com"] && (
                            <div className="flex items-center gap-2">
                              <Icons.XOutlined className="w-5 h-5 text-slate-900 flex-shrink-0" />
                              <a href={content["X.com"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                                X
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
