import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SourceStatusCard from './components/SourceStatusCard';
import RegionSelector from './components/RegionSelector';
import MapViewer from './components/MapViewer';
import TrendChart from './components/TrendChart';
import RankedTrendsTable from './components/RankedTrendsTable';
import MethodologyModal from './components/MethodologyModal';
import StrictPolicyModal from './components/StrictPolicyModal';
import ComparisonModal from './components/ComparisonModal';
import ProvenanceDrawer from './components/ProvenanceDrawer';
import ReportModal from './components/ReportModal';
import {
  fetchApprovedSources,
  fetchSourceStatuses,
  runDiscovery,
  generateScientificReport,
  downloadCSV
} from './services/api';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  GitCompare,
  Layers,
  FileCheck2
} from 'lucide-react';

export default function App() {
  // State
  const [sources, setSources] = useState([]);
  const [sourceStatuses, setSourceStatuses] = useState({});
  const [selectedSources, setSelectedSources] = useState([
    'nasa_giovanni',
    'nasa_hydrology',
    'nasa_appeears',
    'noaa_cdo',
    'knmi_climexp',
    'csa_rcm'
  ]);

  const [region, setRegion] = useState({
    country: "India",
    state: "Maharashtra",
    district: "Pune",
    name: "Pune, Maharashtra, India",
    latitude: 18.5204,
    longitude: 73.8567,
    bbox: [73.5, 18.2, 74.2, 18.8],
    station_id: "GHCND:IN001010300",
    station_name: "Pune Climatological Observatory"
  });

  const [startYear, setStartYear] = useState(2015);
  const [endYear, setEndYear] = useState(2024);
  const [alpha, setAlpha] = useState(0.05);

  const [discoveryData, setDiscoveryData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals & Drawers
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedProvenanceVar, setSelectedProvenanceVar] = useState(null);

  // Load sources and initial discovery
  useEffect(() => {
    async function init() {
      try {
        const srcList = await fetchApprovedSources();
        setSources(srcList);
        
        // Probe connectivity
        fetchSourceStatuses().then(statuses => {
          const map = {};
          statuses.forEach(s => { map[s.id] = s; });
          setSourceStatuses(map);
        }).catch(e => console.warn('Status probe warning:', e));

        // Run automated discovery for initial region
        handleExecuteDiscovery();
      } catch (err) {
        setErrorMsg('Failed to initialize TerraScope core: ' + err.message);
      }
    }
    init();
  }, []);

  const handleToggleSource = (sourceId) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleExecuteDiscovery = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await runDiscovery({
        region,
        start_year: startYear,
        end_year: endYear,
        alpha,
        selected_sources: selectedSources,
      });
      setDiscoveryData(res);
    } catch (err) {
      setErrorMsg(err.message || 'Error executing automated discovery');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenReport = async () => {
    if (!discoveryData) return;
    try {
      const rep = await generateScientificReport(discoveryData);
      setReportData(rep);
      setIsReportOpen(true);
    } catch (err) {
      alert('Error generating report: ' + err.message);
    }
  };

  const handleExportCSV = async () => {
    if (!discoveryData) return;
    try {
      await downloadCSV(discoveryData);
    } catch (err) {
      alert('CSV export error: ' + err.message);
    }
  };

  const summary = discoveryData?.summary;
  const rankedTrends = discoveryData?.ranked_trends || [];
  const rawSeries = discoveryData?.raw_time_series || [];

  return (
    <div className="min-h-screen bg-blue-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenPolicy={() => setIsPolicyOpen(true)}
        onOpenReport={handleOpenReport}
        onExportCSV={handleExportCSV}
        hasResults={Boolean(discoveryData)}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-white text-xs underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Approved Sources Card */}
        <SourceStatusCard
          sources={sources}
          statuses={sourceStatuses}
          selectedSources={selectedSources}
          onToggleSource={handleToggleSource}
          onViewProvenance={(src) => setSelectedProvenanceVar({
            official_source_name: src.official_name,
            original_dataset_identifier: src.api_or_service_endpoint,
            original_access_url: src.official_portal_url,
            temporal_resolution: src.temporal_coverage_general,
            spatial_resolution: src.spatial_coverage_general,
            measurement_units: 'Standardized Physical Units',
            data_processing_info: src.purpose,
            is_demonstration: false
          })}
        />

        {/* Section 2: Geographic Selection & Geospatial Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <RegionSelector
              region={region}
              onRegionChange={(newReg) => setRegion(newReg)}
              startYear={startYear}
              onStartYearChange={setStartYear}
              endYear={endYear}
              onEndYearChange={setEndYear}
              onRunDiscovery={handleExecuteDiscovery}
              isAnalyzing={isAnalyzing}
            />
          </div>
          <div className="lg:col-span-5">
            <MapViewer region={region} />
          </div>
        </div>

        {/* Section 3: Summary Discovery Metrics */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Discovered Variables
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white">
                  {summary.total_variables_analyzed}
                </span>
                <span className="text-xs text-slate-400">from 6 approved sources</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                FDR Significant Trends
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {summary.statistically_significant_trends}
                </span>
                <span className="text-xs text-slate-400">(&alpha; = {summary.fdr_alpha_threshold})</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                Increasing Trends
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-cyan-400">
                  {summary.increasing_trends}
                </span>
                <span className="text-xs text-slate-400">warming / greening</span>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                Decreasing Trends
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-rose-400">
                  {summary.decreasing_trends}
                </span>
                <span className="text-xs text-slate-400">depletion / drying</span>
              </div>
            </div>
          </div>
        )}

        {/* Action bar for Compare & Report */}
        {rankedTrends.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                Automated discovery completed for <strong>{region.name}</strong> ({startYear}–{endYear}).
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Side-by-Side Comparison</span>
              </button>

              <button
                onClick={handleOpenReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>View Scientific Report</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 4: Interactive Time-Series & Sen's Trend Chart */}
        <TrendChart
          rankedTrends={rankedTrends}
          rawSeriesList={rawSeries}
          onViewProvenance={(v) => setSelectedProvenanceVar(v)}
        />

        {/* Section 5: Ranked Multi-Variable Discovery Table */}
        <RankedTrendsTable
          rankedTrends={rankedTrends}
          onSelectVariable={(v) => {
            // Scroll to chart
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
          onViewProvenance={(v) => setSelectedProvenanceVar(v)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>
            <strong>TerraScope</strong> — Automated Multi-Variable Environmental Trend Discovery Platform.
          </p>
          <p className="text-[11px] text-slate-600">
            Strict Data Provenance Policy: NASA Giovanni &bull; NASA Hydrology Time Series &bull; NASA AppEEARS &bull; NOAA CDO &bull; KNMI Climate Explorer &bull; CSA RADARSAT Constellation Mission.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <StrictPolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
      />

      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        rankedTrends={rankedTrends}
        currentRegion={region}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportData={reportData}
        onDownloadCSV={handleExportCSV}
      />

      <ProvenanceDrawer
        isOpen={Boolean(selectedProvenanceVar)}
        onClose={() => setSelectedProvenanceVar(null)}
        variableData={selectedProvenanceVar}
      />
    </div>
  );
}
