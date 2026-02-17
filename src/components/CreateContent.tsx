'use client';

import { useState } from 'react';
import { Icons } from './Icons';

interface CreateContentProps {
  onContentCreated?: () => void;
}

interface FormData {
  "File Name": string;
  "Post Title": string;
  "Description": string;
  "Publication Date": string;
  "Duration": string;
  "YouTube": string;
  "TikTok": string;
  "X.com": string;
  "Type": string;
  "Case": string;
  "SCOTUS Docket no.": string;
}

export default function CreateContent({ onContentCreated }: CreateContentProps) {
  const [formData, setFormData] = useState<FormData>({
    "File Name": "",
    "Post Title": "",
    "Description": "",
    "Publication Date": "",
    "Duration": "",
    "YouTube": "",
    "TikTok": "",
    "X.com": "",
    "Type": "",
    "Case": "",
    "SCOTUS Docket no.": "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData["Post Title"] || !formData["Publication Date"]) {
      setMessage({ type: 'error', text: 'Title and Date are required' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error saving');

      setMessage({ type: 'success', text: 'Content created successfully!' });

      // Reset form
      setFormData({
        "File Name": "",
        "Post Title": "",
        "Description": "",
        "Publication Date": "",
        "Duration": "",
        "YouTube": "",
        "TikTok": "",
        "X.com": "",
        "Type": "",
        "Case": "",
        "SCOTUS Docket no.": "",
      });

      setTimeout(() => {
        setMessage(null);
        onContentCreated?.();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving content' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">
          New Content
        </h2>
        <p className="text-slate-600">Add a new publication</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <Icons.Check className="w-5 h-5 flex-shrink-0" />
            <p>{message.text}</p>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Post Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              name="Post Title"
              value={formData["Post Title"]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Trump v. US: Justice Roberts Opinion"
            />
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              File Name
            </label>
            <input
              type="text"
              name="File Name"
              value={formData["File Name"]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., trump_v_us_roberts"
            />
          </div>

          {/* Publication Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Publication Date *
            </label>
            <input
              type="date"
              name="Publication Date"
              value={formData["Publication Date"]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Type
            </label>
            <select
              name="Type"
              value={formData["Type"]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select a type</option>
              <option value="Primary">Primary</option>
              <option value="Short (landscape)">Short (landscape)</option>
              <option value="Short (portrait)">Short (portrait)</option>
            </select>
          </div>

          {/* Case */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Case
            </label>
            <input
              type="text"
              name="Case"
              value={formData["Case"]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Trump v. United States"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Duration
            </label>
            <input
              type="text"
              name="Duration"
              value={formData["Duration"]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 02:30:00"
            />
          </div>

          {/* SCOTUS Docket no. */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              SCOTUS Docket no.
            </label>
            <input
              type="text"
              name="SCOTUS Docket no."
              value={formData["SCOTUS Docket no."]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 24-1"
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              name="YouTube"
              value={formData["YouTube"]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/..."
            />
          </div>

          {/* TikTok URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              TikTok URL
            </label>
            <input
              type="url"
              name="TikTok"
              value={formData["TikTok"]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://tiktok.com/..."
            />
          </div>

          {/* X.com URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              X.com URL
            </label>
            <input
              type="url"
              name="X.com"
              value={formData["X.com"]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://x.com/..."
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Description
            </label>
            <textarea
              name="Description"
              value={formData["Description"]}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Detailed content description..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icons.Check className="w-5 h-5" />
            {isSubmitting ? 'Saving...' : 'Create Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
