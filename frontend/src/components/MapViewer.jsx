import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Layers, AlertCircle } from 'lucide-react';

// Custom Map center updater
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Marker icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapViewer({ region }) {
  const lat = region?.latitude || 18.5204;
  const lon = region?.longitude || 73.8567;
  const bbox = region?.bbox || [lon - 0.3, lat - 0.3, lon + 0.3, lat + 0.3];

  // Leaflet rectangle bounds: [[south, west], [north, east]]
  const bounds = [
    [bbox[1], bbox[0]],
    [bbox[3], bbox[2]]
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Geospatial Coverage & Observation Topology
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Spatial bounding box, raster grid boundaries, and official meteorological station locations.
          </p>
        </div>
      </div>

      {/* Map view container */}
      <div className="mt-4 flex-1 min-h-[300px] rounded-xl overflow-hidden border border-slate-800 relative">
        <MapContainer
          center={[lat, lon]}
          zoom={8}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
        >
          <ChangeView center={[lat, lon]} zoom={8} />
          {/* CartoDB Dark Matter tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Bounding Box Polygon */}
          <Rectangle
            bounds={bounds}
            pathOptions={{
              color: '#10b981',
              weight: 2,
              dashArray: '4, 4',
              fillColor: '#10b981',
              fillOpacity: 0.12
            }}
          />

          {/* Center / Station Marker */}
          <Marker position={[lat, lon]}>
            <Popup className="text-slate-900">
              <div className="p-1">
                <div className="font-bold text-xs">{region?.name}</div>
                <div className="text-[11px] text-slate-600">
                  Lat: {lat.toFixed(4)}°, Lon: {lon.toFixed(4)}°
                </div>
                {region?.station_name && (
                  <div className="mt-1 pt-1 border-t text-[10px] text-slate-500">
                    Station: {region.station_name}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Spatial Policy Notice Overlay */}
        <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-lg">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Scientific Rule:</strong> Station data (NOAA CDO) displayed at verified station points; spatial gridded masks (NASA Giovanni / AppEEARS) aggregated over the defined bounding box.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
