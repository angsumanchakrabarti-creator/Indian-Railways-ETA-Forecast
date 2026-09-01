import { useMemo, useState } from 'react';
import { RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { corridorSegments, corridorStations, getTrainPosition } from '../data/mockData';
import type { CorridorStation } from '../types';
import type { Train } from '../types';

const statusColors: Record<string, string> = {
  'on-time': '#4caf50',
  minor: '#ff9800',
  major: '#f44336',
  'no-data': '#4a5568',
};

const VIEW_W = 920;
const VIEW_H = 250;

function getStation(stations: CorridorStation[], code: string): CorridorStation | undefined {
  return stations.find((station) => station.code === code);
}

function smoothSegmentPath(stations: CorridorStation[], fromCode: string, toCode: string): string {
  const from = getStation(stations, fromCode);
  const to = getStation(stations, toCode);
  if (!from || !to) return '';
  const bend = Math.abs(from.x - to.x) > 400 ? 18 : 0;
  const cp1x = from.x + (to.x - from.x) * 0.35;
  const cp2x = from.x + (to.x - from.x) * 0.65;
  return `M${from.x},${from.y} C${cp1x},${from.y + bend} ${cp2x},${to.y - bend} ${to.x},${to.y}`;
}

function segmentMidpoint(stations: CorridorStation[], fromCode: string, toCode: string): { x: number; y: number } {
  const from = getStation(stations, fromCode);
  const to = getStation(stations, toCode);
  return { x: ((from?.x ?? 0) + (to?.x ?? 0)) / 2, y: ((from?.y ?? 0) + (to?.y ?? 0)) / 2 - 10 };
}

interface CorridorMapProps {
  train: Train;
  lastUpdate: Date;
  onRefresh: () => void;
}

export default function CorridorMap({ train, lastUpdate, onRefresh }: CorridorMapProps) {
  const [zoom, setZoom] = useState(1);

  const trainPos = useMemo(() => getTrainPosition(train, corridorStations), [train]);

  const liveSegments = useMemo(() => {
    return corridorSegments.map((seg) => {
      const current = train.stations[train.currentStationIndex];
      const next = train.stations[train.currentStationIndex + 1];
      const trainOnSegment = !!current && !!next && (
        (seg.fromCode === current.code && seg.toCode === next.code) ||
        (seg.toCode === current.code && seg.fromCode === next.code)
      );
      if (trainOnSegment && train.delay > 30) return { ...seg, status: 'major' as const, delayMinutes: train.delay };
      if (trainOnSegment && train.delay > 5) return { ...seg, status: 'minor' as const, delayMinutes: train.delay };
      return seg;
    });
  }, [train]);

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col h-full min-h-[320px]">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Corridor Overview
          </h3>
          <p className="text-[10px] text-text-secondary mt-0.5">
            16-city national rail network · {train.fromCode} → {train.toCode} · Updated {lastUpdate.toLocaleTimeString('en-IN', { hour12: false })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
            className="p-1.5 rounded hover:bg-bg-card-hover text-text-secondary transition"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.6))}
            className="p-1.5 rounded hover:bg-bg-card-hover text-text-secondary transition"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded hover:bg-bg-card-hover text-text-secondary transition"
            title="Reset zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRefresh}
            className="p-1.5 rounded hover:bg-bg-card-hover text-text-secondary transition ml-1"
            title="Refresh now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto rounded-lg bg-[#0a0f18] min-h-[220px]">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full min-w-[700px] h-full min-h-[220px]"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Subtle terrain grid */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1="0" y1={20 + i * 24} x2={VIEW_W} y2={20 + i * 24} stroke="#141c2e" strokeWidth="0.5" />
          ))}

          {/* Faint national-network flow hint */}
          <path
            d="M 58,190 Q 250,24 825,67 Q 700,220 145,210"
            stroke="#1a3050"
            strokeWidth="6"
            fill="none"
            opacity="0.5"
          />

          {/* Track bed (dark underlay for depth) */}
          {liveSegments.map((seg) => (
            <path
              key={`bed-${seg.fromCode}`}
              d={smoothSegmentPath(corridorStations, seg.fromCode, seg.toCode)}
              stroke="#0d1520"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
          ))}

          {/* Coloured route segments */}
          {liveSegments.map((seg) => (
            <g key={`${seg.fromCode}-${seg.toCode}`}>
              <path
                d={smoothSegmentPath(corridorStations, seg.fromCode, seg.toCode)}
                stroke={statusColors[seg.status]}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                opacity="0.9"
              />
              {seg.delayMinutes > 0 && (
                <text
                  x={segmentMidpoint(corridorStations, seg.fromCode, seg.toCode).x}
                  y={segmentMidpoint(corridorStations, seg.fromCode, seg.toCode).y}
                  textAnchor="middle"
                  fill={statusColors[seg.status]}
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                >
                  +{seg.delayMinutes}m
                </text>
              )}
            </g>
          ))}

          {/* Station junctions */}
          {corridorStations.map((station) => {
            const isCurrent = train.stations.some(
              (s) => s.code === station.code && (s.status === 'arriving' || s.status === 'current'),
            );
            return (
              <g key={station.code}>
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isCurrent ? 7 : 5}
                  fill={isCurrent ? '#ffc107' : '#121b2b'}
                  stroke={isCurrent ? '#fff' : '#8b9cb8'}
                  strokeWidth={isCurrent ? 2 : 1.5}
                />
                <text
                  x={station.x}
                  y={station.y + 16}
                  textAnchor="middle"
                  fill={isCurrent ? '#ffc107' : '#8b9cb8'}
                  fontSize="8"
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                  fontFamily="Inter, sans-serif"
                >
                  {station.code}
                </text>
                <text
                  x={station.x}
                  y={station.y - 10}
                  textAnchor="middle"
                  fill="#6b7c99"
                  fontSize="7"
                  fontFamily="Inter, sans-serif"
                >
                  {station.km} km
                </text>
              </g>
            );
          })}

          {/* Live train marker */}
          <g>
            <circle cx={trainPos.x} cy={trainPos.y} r="8" fill="#2196f3" stroke="#fff" strokeWidth="2">
              <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <text
              x={trainPos.x}
              y={trainPos.y - 14}
              textAnchor="middle"
              fill="#2196f3"
              fontSize="8"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              {train.number}
            </text>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-text-secondary shrink-0">
        {[
          { color: '#4caf50', label: 'On Time' },
          { color: '#ff9800', label: 'Minor (5–30m)' },
          { color: '#f44336', label: 'Major (>30m)' },
          { color: '#4a5568', label: 'No Data' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
        <span className="ml-auto text-accent-blue font-mono">● {train.number} live · {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}





