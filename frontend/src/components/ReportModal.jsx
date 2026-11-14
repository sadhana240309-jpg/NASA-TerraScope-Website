import React, { useState } from 'react';
import { X, FileText, Copy, Check, Download, BookOpen } from 'lucide-react';

export default function ReportModal({
  isOpen,
  onClose,
  reportData,
  onDownloadCSV
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !reportData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportData.executive_summary || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              TerraScope Scientific Executive Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 text-xs text-slate-300">
          {/* Executive Summary Markdown Preview */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 leading-relaxed whitespace-pre-wrap font-sans">
            {reportData.executive_summary}
          </div>

          {/* Strict Data Policy Attestation */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400">
            <strong>Data Integrity Attestation:</strong> {reportData.strict_data_policy_attestation}
          </div>

          {/* Citations List */}
          <div>
            <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Methodological Citations
            </h3>
            <div className="space-y-2">
              {reportData.methodological_references?.map((ref, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-lg text-[11px]">
                  <div className="font-medium text-slate-200">{ref.citation}</div>
                  <div className="text-slate-400 mt-0.5">{ref.application}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Data</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
