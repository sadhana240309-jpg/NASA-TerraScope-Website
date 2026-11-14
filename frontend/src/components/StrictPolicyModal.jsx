import React from 'react';
import { X, ShieldCheck, Check, AlertOctagon, Lock } from 'lucide-react';

export default function StrictPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              TerraScope Strict Data Source Policy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mt-5 text-xs leading-relaxed text-slate-300">
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300 mb-0.5">Strict Authorized Sources Mandate</div>
              <p className="text-[11px] text-emerald-400/90">
                All environmental observations utilized by TerraScope originate exclusively from the six approved federal Earth science archives. No third-party APIs, Kaggle dumps, synthetic files presented as real, or unverified repositories are permitted.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white">The Six Approved Archives:</h3>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>1. NASA Giovanni:</strong> https://giovanni.gsfc.nasa.gov/giovanni/</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>2. NASA Hydrology Time Series:</strong> GES DISC Hydrology Data Rods</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>3. NASA AppEEARS:</strong> https://appeears.earthdatacloud.nasa.gov/</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>4. NOAA Climate Data Online (CDO):</strong> https://www.ncei.noaa.gov/cdo-web/</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>5. KNMI Climate Explorer:</strong> https://climexp.knmi.nl/</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>6. CSA RADARSAT Constellation Mission:</strong> https://www.asc-csa.gc.ca/</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="font-semibold text-white">Strict Transparency Rules:</h3>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <p>• <strong>Never Silently Substitute:</strong> If an approved source cannot be reached, TerraScope reports its exact status and reason; it never silently fetches data from an unapproved service.</p>
              <p>• <strong>Demonstration Isolation:</strong> Any test data required during development or local runs is explicitly stamped with <span className="text-amber-400 font-mono font-bold">DEMONSTRATION DATA</span> and never mixed with real observations.</p>
              <p>• <strong>Full Provenance:</strong> Every single observation record tracks the original dataset identifier, service URL, spatial and temporal resolution, measurement units, and retrieval timestamp.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
}
