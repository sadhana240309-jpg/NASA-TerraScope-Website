import React from 'react';
import { X, BookOpen, CheckCircle, ExternalLink, Calculator, Layers } from 'lucide-react';

export default function MethodologyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Scientific Methodology & Statistical Standards
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 mt-5 text-xs leading-relaxed text-slate-300">
          {/* Methodological References */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              1. Methodological & Research References
            </h3>
            <p className="text-slate-400 mb-3">
              TerraScope strictly adheres to the mathematical formulations and protocols established in the project's peer-reviewed references:
            </p>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="font-semibold text-white">
                  1. Research Article: Time-Series Analysis of Remotely-Sensed SeaWiFS Chlorophyll in River-Influenced Coastal Regions
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  <strong>Application:</strong> Protocol for remote sensing time-series quality screening, missing value handling, temporal de-seasoning, and non-parametric trend stability.
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="font-semibold text-white">
                  2. Statistical Test Methods to Detect Trends in Time Series Data
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  <strong>Application:</strong> Formulation of the Mann-Kendall test statistic S, tie-adjustment in variance calculation, and Sen's non-parametric slope estimator.
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="font-semibold text-white">
                  3. A Comprehensive Guide to Statistical Significance & Multiple Testing
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  <strong>Application:</strong> Implementation of the Benjamini-Hochberg (BH) False Discovery Rate (FDR) control procedure across simultaneously evaluated environmental parameters.
                </div>
              </div>
            </div>
          </div>

          {/* Statistical Formulations */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              2. Core Mathematical Formulations
            </h3>
            
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-white text-xs">A. Mann-Kendall Trend Test (Non-Parametric)</div>
                <p className="text-[11px] text-slate-400">
                  Calculates Kendall's S statistic over all chronological observation pairs:
                </p>
                <div className="font-mono bg-slate-900 px-3 py-2 rounded text-[11px] text-emerald-400">
                  S = &Sigma;[k=1 to n-1] &Sigma;[j=k+1 to n] sgn(x_j - x_k)
                </div>
                <p className="text-[11px] text-slate-400">
                  Variance of S is adjusted for identical values (ties). The standard normal test statistic Z is evaluated against a two-tailed Gaussian distribution.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-white text-xs">B. Sen's Slope Estimator</div>
                <p className="text-[11px] text-slate-400">
                  The true non-parametric rate of change is computed as the median of all pairwise temporal slopes:
                </p>
                <div className="font-mono bg-slate-900 px-3 py-2 rounded text-[11px] text-emerald-400">
                  Q_k = (x_j - x_i) / (t_j - t_i), &nbsp; Sen's Slope = Median(Q)
                </div>
                <p className="text-[11px] text-slate-400">
                  Robust to up to 29% gross observation outliers and extreme seasonal events.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-white text-xs">C. False Discovery Rate (FDR) Correction (Benjamini-Hochberg)</div>
                <p className="text-[11px] text-slate-400">
                  When simultaneously discovering dozens of environmental variables, FDR controls the expected proportion of spurious false alarms:
                </p>
                <div className="font-mono bg-slate-900 px-3 py-2 rounded text-[11px] text-emerald-400">
                  p_adj(i) = min(1.0, min[k &ge; i] (m / k * p_raw(k)))
                </div>
                <p className="text-[11px] text-slate-400">
                  Guarantees that discoveries reported as statistically significant meet the nominal false discovery threshold (&alpha; = 0.05).
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-white text-xs">D. Variability Normalization</div>
                <p className="text-[11px] text-slate-400">
                  To prevent ranking bias between heterogeneous units (e.g., mm precipitation vs. °C temperature), variables are ranked by Standardized Slope (Z-score change / year) and Relative Change (% / year).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
