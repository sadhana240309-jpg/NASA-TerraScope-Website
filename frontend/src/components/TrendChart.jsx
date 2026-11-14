import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, BarChart3 } from 'lucide-react';

export default function TrendChart({
  rankedTrends = [],
  rawSeriesList = [],
  onViewProvenance
}) {
  const [selectedVarIdx, setSelectedVarIdx] = useState(0);

  if (!rankedTrends || rankedTrends.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        Run automated discovery to view environmental time series and trend lines.
      </div>
    );
  }

  const currentTrend = rankedTrends[selectedVarIdx] || rankedTrends[0];
  const currentRaw = rawSeriesList.find(s => s.variable_code === currentTrend.variable_code) || rawSeriesList[0];

  // Merge raw observations with fitted Sen's slope line
  const fittedMap = {};
  if (currentTrend.fitted_trend_line) {
    currentTrend.fitted_trend_line.forEach(item => {
      fittedMap[item.date] = item.fitted_value;
    });
  }

  const chartData = (currentRaw?.dates || []).map((d, i) => {
    return {
      date: d,
      observed: currentRaw.values[i],
      fitted: fittedMap[d] !== undefined ? fittedMap[d] : null,
    };
  });

  const isSignificant = currentTrend.is_statistically_significant;
  const isIncreasing = currentTrend.trend_direction === 'Increasing trend';
  const isDecreasing = currentTrend.trend_direction === 'Decreasing trend';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header & Variable Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Environmental Time Series & Sen's Slope Trendline
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-parametric median slope overlaid onto genuine Earth observation time series.
          </p>
        </div>

        {/* Variable Selector Tabs / Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Select Variable:</label>
          <select
            value={selectedVarIdx}
            onChange={(e) => setSelectedVarIdx(parseInt(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[280px] truncate"
          >
            {rankedTrends.map((t, idx) => (
              <option key={t.variable_code} value={idx}>
                {t.variable_name} ({t.official_source_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Variable Diagnostic Bar */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 block">Trend Classification</span>
          <div className="flex items-center gap-1.5 font-bold mt-0.5">
            {isIncreasing && <TrendingUp className="w-4 h-4 text-emerald-400" />}
            {isDecreasing && <TrendingDown className="w-4 h-4 text-rose-400" />}
            {!isSignificant && <Minus className="w-4 h-4 text-slate-400" />}
            <span
              className={
                isSignificant
                  ? isIncreasing
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                  : 'text-slate-300'
              }
            >
              {currentTrend.trend_direction}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">Annual Rate of Change</span>
          <span className="font-mono font-bold text-white text-sm mt-0.5 block">
            {currentTrend.annual_rate_of_change > 0 ? '+' : ''}
            {currentTrend.annual_rate_of_change} {currentTrend.original_measurement_unit}/yr
          </span>
          <span className="text-[10px] text-slate-400">
            ({currentTrend.relative_annual_change_pct > 0 ? '+' : ''}{currentTrend.relative_annual_change_pct}% / yr)
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">FDR-Adjusted P-Value</span>
          <span className="font-mono font-bold text-white text-sm mt-0.5 block">
            {currentTrend.fdr_adjusted_p_value.toExponential(3)}
          </span>
          <span className="text-[10px] text-slate-400">
            Raw p: {currentTrend.p_value.toFixed(5)} (tau: {currentTrend.kendall_tau})
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">Dataset Source & Unit</span>
          <span className="font-semibold text-emerald-300 truncate block mt-0.5">
            {currentTrend.official_source_name}
          </span>
          <span className="text-[10px] text-slate-400">
            Unit: {currentTrend.original_measurement_unit}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-4 h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 15, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={Math.floor(chartData.length / 8) || 1}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              domain={['auto', 'auto']}
              label={{
                value: currentTrend.original_measurement_unit,
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
                fontSize: 10,
                offset: 5
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
              formatter={(value, name) => [
                value !== null ? `${value} ${currentTrend.original_measurement_unit}` : 'Missing Observation',
                name === 'observed' ? 'Monthly Observation' : "Sen's Slope Trendline"
              ]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-xs text-slate-300">
                  {value === 'observed'
                    ? `Observed Series (${currentTrend.official_source_name})`
                    : "Fitted Non-Parametric Trend (Sen's Slope)"}
                </span>
              )}
            />
            {/* Raw observations line */}
            <Line
              type="monotone"
              dataKey="observed"
              stroke="#38bdf8"
              strokeWidth={1.8}
              dot={{ r: 2, fill: '#38bdf8' }}
              activeDot={{ r: 5 }}
              name="observed"
              connectNulls={false}
            />
            {/* Sen's slope trend line */}
            <Line
              type="linear"
              dataKey="fitted"
              stroke={isSignificant ? '#10b981' : '#94a3b8'}
              strokeWidth={2.5}
              strokeDasharray={isSignificant ? 'none' : '5 5'}
              dot={false}
              name="fitted"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Scientific Interpretation */}
      <div className="mt-2 pt-3 border-t border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Scientific Finding:</strong> {currentTrend.scientific_summary}
        </p>
      </div>
    </div>
  );
}
