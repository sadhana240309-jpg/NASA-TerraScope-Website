import React, { useState } from 'react';
import { MapPin, Calendar, Search, Sparkles, Navigation } from 'lucide-react';

const REGION_PRESETS = [
  {
    country: "India",
    state: "Maharashtra",
    district: "Pune",
    name: "Pune, Maharashtra, India",
    latitude: 18.5204,
    longitude: 73.8567,
    bbox: [73.5, 18.2, 74.2, 18.8],
    station_id: "GHCND:IN001010300",
    station_name: "Pune Climatological Observatory"
  },
  {
    country: "India",
    state: "Karnataka",
    district: "Bengaluru",
    name: "Bengaluru, Karnataka, India",
    latitude: 12.9716,
    longitude: 77.5946,
    bbox: [77.3, 12.7, 77.8, 13.2],
    station_id: "GHCND:IN001040100",
    station_name: "Bengaluru Central Weather Station"
  },
  {
    country: "India",
    state: "Delhi",
    district: "New Delhi",
    name: "New Delhi (NCR), India",
    latitude: 28.6139,
    longitude: 77.2090,
    bbox: [76.9, 28.4, 77.4, 28.9],
    station_id: "GHCND:IN001080300",
    station_name: "Safdarjung Delhi Regional Observatory"
  },
  {
    country: "United States",
    state: "California",
    district: "Central Valley (Fresno)",
    name: "Central Valley, California, USA",
    latitude: 36.7468,
    longitude: -119.7726,
    bbox: [-120.2, 36.4, -119.3, 37.1],
    station_id: "GHCND:USW00093193",
    station_name: "Fresno Yosemite International AP"
  },
  {
    country: "Canada",
    state: "Saskatchewan",
    district: "Prince Albert",
    name: "Saskatchewan Boreal, Canada",
    latitude: 53.2033,
    longitude: -105.7531,
    bbox: [-106.2, 52.8, -105.2, 53.6],
    station_id: "GHCND:CA004056240",
    station_name: "Prince Albert Climate Station"
  },
  {
    country: "Germany",
    state: "North Rhine-Westphalia",
    district: "Cologne / Rhine Basin",
    name: "Rhine Catchment, Germany",
    latitude: 50.9375,
    longitude: 6.9603,
    bbox: [6.6, 50.6, 7.3, 51.2],
    station_id: "GHCND:GME00122204",
    station_name: "Koeln-Bonn Airport Observatory"
  }
];

export default function RegionSelector({
  region,
  onRegionChange,
  startYear,
  onStartYearChange,
  endYear,
  onEndYearChange,
  onRunDiscovery,
  isAnalyzing
}) {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);

  const handlePresetSelect = (idx) => {
    setSelectedPresetIdx(idx);
    onRegionChange(REGION_PRESETS[idx]);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            Target Region & Temporal Window
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            TerraScope will automatically discover all available variables across the 6 approved sources for this region.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Preset Selector */}
        <div className="lg:col-span-5 space-y-3">
          <label className="block text-xs font-medium text-slate-300">
            Geographical Region Preset
          </label>
          <div className="grid grid-cols-2 gap-2">
            {REGION_PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePresetSelect(idx)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  selectedPresetIdx === idx
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div className="font-semibold text-slate-200 truncate">{preset.district || preset.state}</div>
                <div className="text-[10px] text-slate-400 truncate">{preset.country}</div>
              </button>
            ))}
          </div>

          {/* Current details badge */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/90 rounded-xl text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Coordinates:</span>
              <span className="font-mono text-emerald-400">
                {region.latitude?.toFixed(3)}°N, {region.longitude?.toFixed(3)}°E
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Bounding Box:</span>
              <span className="font-mono text-slate-300 text-[11px]">
                [{region.bbox?.map(b => b.toFixed(2)).join(', ')}]
              </span>
            </div>
            {region.station_name && (
              <div className="flex justify-between text-slate-400">
                <span>NOAA Station:</span>
                <span className="text-slate-300 truncate max-w-[200px]" title={region.station_name}>
                  {region.station_name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Time Selection & Run Trigger */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Analysis Time Period ({endYear - startYear + 1} Years)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Start Year</span>
                <select
                  value={startYear}
                  onChange={(e) => onStartYearChange(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {[2000, 2005, 2010, 2012, 2015, 2018, 2020].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">End Year</span>
                <select
                  value={endYear}
                  onChange={(e) => onEndYearChange(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {[2018, 2020, 2022, 2023, 2024, 2025].map((yr) => (
                    <option key={yr} value={yr} disabled={yr <= startYear + 2}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Non-parametric Mann-Kendall trend tests require a multi-year baseline (&ge; 3 years) to prevent seasonal autocorrelation artifacts.
            </p>
          </div>

          {/* Automated Discovery Run Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onRunDiscovery}
              disabled={isAnalyzing}
              className="w-full py-3 px-5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Discovering & Analyzing Variables...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Execute Automated Multi-Variable Discovery</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
