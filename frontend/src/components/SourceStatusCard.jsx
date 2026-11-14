import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, Shield, Check, Info } from 'lucide-react';

export default function SourceStatusCard({
  sources = [],
  statuses = {},
  selectedSources = [],
  onToggleSource,
  onViewProvenance
}) {
  const getStatusBadge = (statusObj) => {
    if (!statusObj) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ONLINE
        </span>
      );
    }

    const st = statusObj.status;
    if (st === 'ONLINE') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ONLINE
        </span>
      );
    } else if (st === 'AUTHENTICATION_REQUIRED') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
          <AlertTriangle className="w-3 h-3 text-amber-400" /> AUTH REQUIRED
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          <AlertTriangle className="w-3 h-3 text-slate-400" /> {st || 'ONLINE'}
        </span>
      );
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Approved Environmental Data Sources
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict Multi-Source Architecture: Only datasets from these 6 authorized archives are admitted.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Active: <span className="font-semibold text-emerald-400">{selectedSources.length}</span> / 6
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {sources.map((src) => {
          const statusObj = statuses[src.id];
          const isSelected = selectedSources.includes(src.id);

          return (
            <div
              key={src.id}
              className={`relative rounded-xl border p-4 transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-850 border-emerald-500/30 shadow-md shadow-emerald-950/20'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSource(src.id)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">
                      {src.official_name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {src.organization}
                    </p>
                  </div>
                </label>
                {getStatusBadge(statusObj)}
              </div>

              {/* Supported parameters summary */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/70 text-[11px]">
                <div className="text-slate-400 font-medium mb-1">Available Parameters:</div>
                <div className="flex flex-wrap gap-1">
                  {src.available_environmental_parameters.slice(0, 2).map((param, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] truncate max-w-[200px]"
                    >
                      {param}
                    </span>
                  ))}
                  {src.available_environmental_parameters.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[10px]">
                      +{src.available_environmental_parameters.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Status explanation & portal link */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/50">
                <a
                  href={src.official_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => onViewProvenance(src)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Info className="w-3 h-3" />
                  <span>Metadata</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
