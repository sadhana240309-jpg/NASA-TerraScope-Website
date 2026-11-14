const API_BASE = '/api/v1';

export async function fetchApprovedSources() {
  const res = await fetch(`${API_BASE}/sources`);
  if (!res.ok) throw new Error('Failed to load approved sources list');
  return res.json();
}

export async function fetchSourceStatuses() {
  const res = await fetch(`${API_BASE}/sources/status`);
  if (!res.ok) throw new Error('Failed to probe sources connectivity');
  return res.json();
}

export async function runDiscovery(payload) {
  const res = await fetch(`${API_BASE}/discovery/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Automated discovery failed');
  }
  return res.json();
}

export async function runComparison(payload) {
  const res = await fetch(`${API_BASE}/analysis/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Comparison analysis failed');
  return res.json();
}

export async function generateScientificReport(discoveryData) {
  const res = await fetch(`${API_BASE}/export/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ discovery_data: discoveryData }),
  });
  if (!res.ok) throw new Error('Report generation failed');
  return res.json();
}

export async function downloadCSV(discoveryData) {
  const res = await fetch(`${API_BASE}/export/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ discovery_data: discoveryData }),
  });
  if (!res.ok) throw new Error('CSV download failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `terrascope_environmental_trends_${discoveryData.region?.name || 'region'}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
