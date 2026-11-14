import React, { useState } from 'react';
import { X, GitCompare, ArrowRight, BarChart2, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function ComparisonModal({
  isOpen,
  onClose,
  rankedTrends = [],
  currentRegion
}) {
  const [varAIdx, setVarAIdx] = useState(0);
  const [varBIdx, setVarBIdx] = useState(rankedTrends.length > 1 ? 1 : 0);

  if (!isOpen) return null;

  const itemA = rankedTrends[varAIdx] || rankedTrends[0];
  const itemB = rankedTrends[varBIdx] || rankedTrends[1] || rankedTrends[0];

  // Normalized comparison chart data (Standardized Slope & Relative % change)
  const comparisonData = [
    {
      metric: 'Std. Rate (Z/yr)',
      [itemA?.variable_name || 'Var A']: itemA?.standardized_slope || 0,
      [itemB?.variable_name || 'Var B']: itemB?.standardized_slope || 0,
    },
    {
      metric: 'Relative Change (%/yr)',
      [itemA?.variable_name || 'Var A']: itemA?.relative_annual_change_pct || 0,
      [itemB?.variable_name || 'Var B']: itemB?.relative_annual_change_pct || 0,
    },
    {
      metric: "Kendall's Tau",
      [itemA?.variable_name || 'Var A']: (itemA?.kendall_tau || 0) * 10, // scaled for display
      [itemB?.variable_name || 'Var B']: (itemB?.kendall_tau || 0) * 10,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Multi-Variable & Cross-Source Scientific Comparison
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-xs">
          {/* Scientific Comparability Warning */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-cyan-300 text-[11px] leading-relaxed">
            <strong>Scientific Principle:</strong> Direct numerical comparison of raw rates between variables with different physical units (e.g., mm/yr vs. °C/yr) is invalid. TerraScope normalizes rates via <em>Standardized Slopes (Z-score change / yr)</em> and <em>Relative Annual Change (%)</em> to allow mathematically fair comparison.
          </div>

          {/* Selectors for Variable A and Variable B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                Variable A (Baseline)
              </span>
              <select
                value={varAIdx}
                onChange={(e) => setVarAIdx(parseInt(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {rankedTrends.map((t, idx) => (
                  <option key={t.variable_code} value={idx}>
                    {t.variable_name} — {t.official_source_name}
                  </option>
                ))}
              </select>

              {itemA && (
                <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                  <div>Source: <span className="text-white font-medium">{itemA.official_source_name}</span></div>
                  <div>Trend: <span className="text-emerald-400 font-semibold">{itemA.trend_direction}</span></div>
                  <div>Raw Slope: <span className="font-mono text-white">{itemA.annual_rate_of_change} {itemA.original_measurement_unit}/yr</span></div>
                  <div>FDR P-Value: <span className="font-mono text-white">{itemA.fdr_adjusted_p_value.toExponential(2)}</span></div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                Variable B (Comparison)
              </span>
              <select
                value={varBIdx}
                onChange={(e) => setVarBIdx(parseInt(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {rankedTrends.map((t, idx) => (
                  <option key={t.variable_code} value={idx}>
                    {t.variable_name} — {t.official_source_name}
                  </option>
                ))}
              </select>

              {itemB && (
                <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                  <div>Source: <span className="text-white font-medium">{itemB.official_source_name}</span></div>
                  <div>Trend: <span className="text-cyan-400 font-semibold">{itemB.trend_direction}</span></div>
                  <div>Raw Slope: <span className="font-mono text-white">{itemB.annual_rate_of_change} {itemB.original_measurement_unit}/yr</span></div>
                  <div>FDR P-Value: <span className="font-mono text-white">{itemB.fdr_adjusted_p_value.toExponential(2)}</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Normalized Comparison Bar Chart */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
            <h3 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              Variability-Normalized Comparative Metrics
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                  />
                  <Legend verticalAlign="top" height={30} />
                  <Bar
                    dataKey={itemA?.variable_name || 'Var A'}
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey={itemB?.variable_name || 'Var B'}
                    fill="#38bdf8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
