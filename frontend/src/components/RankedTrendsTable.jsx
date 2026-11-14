import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  Info
} from 'lucide-react';

export default function RankedTrendsTable({
  rankedTrends = [],
  onSelectVariable,
  onViewProvenance
}) {
  if (!rankedTrends || rankedTrends.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-emerald-400" />
            Ranked Environmental Trend Discovery
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Variables ranked by FDR significance and variability-normalized rate of change (standardized slope).
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{rankedTrends.length}</span> discovered parameters
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
              <th className="py-3 px-3">Rank</th>
              <th className="py-3 px-3">Environmental Variable</th>
              <th className="py-3 px-3">Data Source</th>
              <th className="py-3 px-3">Trend Direction</th>
              <th className="py-3 px-3">Sen's Slope & Units</th>
              <th className="py-3 px-3">Std. Rate (Z/yr)</th>
              <th className="py-3 px-3">FDR P-Value</th>
              <th className="py-3 px-3">Valid Obs</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {rankedTrends.map((item, index) => {
              const isSignificant = item.is_statistically_significant;
              const isIncreasing = item.trend_direction === 'Increasing trend';
              const isDecreasing = item.trend_direction === 'Decreasing trend';

              return (
                <tr
                  key={item.variable_code}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectVariable && onSelectVariable(item)}
                >
                  <td className="py-3 px-3 font-mono text-slate-400">
                    #{index + 1}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.variable_name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.variable_code}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 text-[10px] font-semibold border border-slate-700/60 whitespace-nowrap">
                      {item.official_source_name}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="inline-flex items-center gap-1">
                      {isIncreasing && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          <TrendingUp className="w-3 h-3" /> Increasing
                        </span>
                      )}
                      {isDecreasing && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                          <TrendingDown className="w-3 h-3" /> Decreasing
                        </span>
                      )}
                      {!isSignificant && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          <Minus className="w-3 h-3" /> No Trend
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <div className="text-white font-bold">
                      {item.annual_rate_of_change > 0 ? '+' : ''}
                      {item.annual_rate_of_change}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans">
                      {item.original_measurement_unit}/yr
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <span
                      className={`font-semibold ${
                        isSignificant
                          ? Math.abs(item.standardized_slope) > 0.05
                            ? 'text-cyan-400'
                            : 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.standardized_slope > 0 ? '+' : ''}
                      {item.standardized_slope.toFixed(3)}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-white">
                      {item.fdr_adjusted_p_value.toExponential(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      raw: {item.p_value.toFixed(4)}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-400">
                    <div>
                      {item.valid_observations_count} / {item.total_observations_count}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {(item.coverage_ratio * 100).toFixed(0)}% valid
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProvenance(item);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Inspect Provenance & Methodology"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
