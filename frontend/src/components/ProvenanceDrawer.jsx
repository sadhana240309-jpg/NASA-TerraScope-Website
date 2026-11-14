import React from 'react';
import { X, Shield, ExternalLink, Calendar, MapPin, Gauge, Database, AlertCircle } from 'lucide-react';

export default function ProvenanceDrawer({ isOpen, onClose, variableData }) {
  if (!isOpen || !variableData) return null;

  const prov = variableData.provenance || variableData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full overflow-y-auto shadow-2xl p-6 text-slate-200 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">
                  Dataset Provenance & Verification
                </h2>
                <p className="text-[11px] text-slate-400">
                  Strict Source Metadata Record
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Demonstration Warning (if applicable) */}
          {prov.is_demonstration && (
            <div className="mt-4 p-3 bg-amber-950/50 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-300">DEMONSTRATION DATA</div>
                <div className="text-[11px] text-amber-300/80 mt-0.5">
                  Calibrated local demonstration series based on official climatologies. Offline development mode is active.
                </div>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="mt-5 space-y-4 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Official Source Name</span>
              <span className="font-bold text-white text-sm text-emerald-400">
                {prov.official_source_name || variableData.official_source_name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 block">Dataset Identifier</span>
                <span className="font-mono text-slate-200 text-[11px] break-all">
                  {prov.original_dataset_identifier || variableData.variable_code}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 block">Measurement Units</span>
                <span className="font-semibold text-white">
                  {prov.measurement_units || variableData.original_measurement_unit}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 block">Temporal Resolution</span>
                <span className="text-slate-200">
                  {prov.temporal_resolution || 'Monthly'}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 block">Spatial Resolution</span>
                <span className="text-slate-200">
                  {prov.spatial_resolution || 'Gridded Regional Mean'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 block">Data Processing & Quality Method</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {prov.data_processing_info || 'Spatially filtered and QA-screened observations.'}
              </p>
            </div>

            {prov.original_access_url && (
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[11px] text-slate-400 block">Original Access URL / Query Reference</span>
                <a
                  href={prov.original_access_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-cyan-400 hover:underline break-all block flex items-center gap-1"
                >
                  <span className="truncate">{prov.original_access_url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between text-[11px] text-slate-400">
              <span>Retrieval Timestamp:</span>
              <span className="font-mono text-slate-300">
                {prov.retrieval_timestamp ? new Date(prov.retrieval_timestamp).toLocaleString() : 'Live Pipeline'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close Provenance Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
