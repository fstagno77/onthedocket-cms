'use client';

import { useState, useMemo } from 'react';
import { formatDate, daysUntil, isUpcoming } from '@/src/lib/utils';
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

interface TimelineProps {
  contents: Content[];
  onEditClick?: (index: number, content: Content) => void;
  onDeleteClick?: (index: number) => void;
}

export default function Timeline({ contents, onEditClick, onDeleteClick }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'Primary' | 'Short'>('all');

  const upcoming = useMemo(() => {
    let filtered = contents
      .map((c, idx) => ({ ...c, originalIdx: idx }))
      .filter(c => c["Publication Date"] && isUpcoming(c["Publication Date"]))
      .filter(c => filterType === 'all' || c["Type"] === filterType)
      .sort((a, b) => {
        const dateA = new Date(a["Publication Date"] || '');
        const dateB = new Date(b["Publication Date"] || '');
        let dateCompare = dateA.getTime() - dateB.getTime();

        // Applica ordinamento ascendente/discendente
        if (sortOrder === 'desc') {
          dateCompare = -dateCompare;
        }

        // Se stessa data: Primary prima di Short
        if (dateCompare === 0) {
          const typeA = a["Type"]?.toLowerCase() === 'primary' ? 0 : 1;
          const typeB = b["Type"]?.toLowerCase() === 'primary' ? 0 : 1;
          return typeA - typeB;
        }

        return dateCompare;
      });

    return filtered;
  }, [contents, sortOrder, filterType]);

  const getPriorityBadge = (dateString?: string | null) => {
    if (!dateString) return null;
    const days = daysUntil(dateString);

    if (days === 0) return { label: 'TODAY', color: 'bg-red-100 text-red-700' };
    if (days === 1) return { label: 'TOMORROW', color: 'bg-orange-100 text-orange-700' };
    if (days <= 3) return { label: 'URGENT', color: 'bg-yellow-100 text-yellow-700' };
    return { label: `in ${days}d`, color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Upcoming Content
          </h2>
          <p className="text-slate-600">Scheduled for the next 14 days</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-blue-600">{upcoming.length}</div>
          <p className="text-sm text-slate-600">scheduled</p>
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Sort Button */}
          <div className="flex items-center gap-2">
            <Icons.Sort className="w-5 h-5 text-slate-600" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 text-sm"
            >
              <option value="asc">Date: Earliest First</option>
              <option value="desc">Date: Latest First</option>
            </select>
          </div>

          {/* Filter Button */}
          <div className="flex items-center gap-2">
            <Icons.Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'Primary' | 'Short')}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 text-sm"
            >
              <option value="all">All types</option>
              <option value="Primary">Primary</option>
              <option value="Short">Short</option>
            </select>
          </div>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-16 text-center">
          <p className="text-slate-500 text-lg">No content scheduled</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {upcoming.map((content, idx) => {
            const badge = getPriorityBadge(content["Publication Date"]);
            const isExpanded = expandedId === idx;

            return (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all"
              >
                {/* Main Content Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : idx)}
                  className="w-full p-6 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    {/* Date Section */}
                    <div className="flex-shrink-0 w-32">
                      <div className="text-sm font-medium text-slate-600 mb-2">
                        {formatDate(content["Publication Date"])}
                      </div>
                      {badge && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 flex-1">
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
                        <p className="text-sm text-slate-600 mb-2">
                          {content["Case"]}
                        </p>
                      )}
                      <p className="text-sm text-slate-500 line-clamp-1">
                        {content["Description"]?.substring(0, 100)}...
                      </p>
                    </div>

                    {/* Platforms & Actions */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <div className="flex gap-2">
                        {content["YouTube"] && (
                          <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center" title="YouTube">
                            <Icons.Play className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                        {content["TikTok"] && (
                          <div className="w-8 h-8 rounded bg-black flex items-center justify-center" title="TikTok">
                            <span className="text-white text-xs font-bold">TT</span>
                          </div>
                        )}
                        {content["X.com"] && (
                          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center" title="X">
                            <span className="text-white text-xs font-bold">X</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 pl-2 border-l border-slate-200">
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
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
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
                      <p className="text-slate-700 text-sm whitespace-pre-wrap line-clamp-6">
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
