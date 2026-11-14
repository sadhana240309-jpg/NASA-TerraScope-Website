import React from 'react';
import { Globe2, ShieldCheck, BookOpen, Download, FileText, Activity } from 'lucide-react';

export default function Header({
  onOpenMethodology,
  onOpenPolicy,
  onOpenReport,
  onExportCSV,
  hasResults,
  isAnalyzing
}) {
  return (
    <header className="border-b border-blue-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Globe2 className="w-6 h-6 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                TerraScope
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v1.0 Science
                </span>
              </h1>
            </div>
            <p className="text-xs text-blue-600">
              Automated Multi-Variable Environmental Trend Discovery Platform
            </p>
          </div>
        </div>

        {/* Action buttons & Provenance badge */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onOpenPolicy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict 6 Sources Policy</span>
          </button>

          <button
            onClick={onOpenMethodology}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-800 bg-blue-50/80 border border-slate-700 hover:bg-slate-700/80 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Methodology & References</span>
          </button>

          {hasResults && (
            <>
              <button
                onClick={onOpenReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Executive Report</span>
              </button>

              <button
                onClick={onExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Export CSV</span>
              </button>
            </>
          )}

          {isAnalyzing && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-pulse">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Trends...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
