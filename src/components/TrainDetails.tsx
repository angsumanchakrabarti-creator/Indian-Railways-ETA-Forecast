import { Check, Circle } from 'lucide-react';
import type { Train } from '../types';
import { formatDelay } from '../data/mockData';

interface TrainDetailsProps {
  train: Train;
}

function StationIcon({ status }: { status: string }) {
  if (status === 'departed') {
    return (
      <div className="w-5 h-5 rounded-full bg-accent-green/20 flex items-center justify-center z-10">
        <Check className="w-3 h-3 text-accent-green" />
      </div>
    );
  }
  if (status === 'arriving' || status === 'current') {
    return (
      <div className="w-5 h-5 rounded-full bg-accent-yellow/20 flex items-center justify-center pulse-current z-10">
        <Circle className="w-3 h-3 text-accent-yellow fill-accent-yellow" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full border border-border bg-bg-card flex items-center justify-center z-10">
      <Circle className="w-2.5 h-2.5 text-text-secondary" />
    </div>
  );
}

function statusLabel(status: string, predictedArrival: string): string {
  switch (status) {
    case 'departed':
      return `Departed ${predictedArrival}`;
    case 'arriving':
      return 'Arriving';
    case 'current':
      return 'At Station';
    default:
      return 'Upcoming';
  }
}

export default function TrainDetails({ train }: TrainDetailsProps) {
  const delayClass =
    train.delay > 30
      ? 'bg-accent-red/20 text-accent-red border-accent-red/30'
      : train.delay > 0
        ? 'bg-accent-orange/20 text-accent-orange border-accent-orange/30'
        : 'bg-accent-green/20 text-accent-green border-accent-green/30';

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col min-h-[320px]">
      <div className="flex items-start justify-between gap-3 mb-4 shrink-0">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-base lg:text-lg font-bold font-mono">
              {train.number} {train.fromCode} → {train.toCode}
            </h2>
            <span className="text-text-secondary hidden sm:inline">|</span>
            <span className="text-sm text-text-secondary truncate">{train.name}</span>
            <span className="text-[10px] bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded font-medium shrink-0">
              {train.type}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold shrink-0 ${delayClass}`}>
          {train.delay > 0 ? `DELAYED ${formatDelay(train.delay)}` : 'ON TIME'}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4 text-xs shrink-0">
        {[
          { label: 'Start', value: `${train.from} (${train.fromCode})` },
          { label: 'Destination', value: `${train.to} (${train.toCode})` },
          { label: 'Distance', value: `${train.distance.toLocaleString()} km` },
          { label: 'Status', value: train.runningStatus },
        ].map((item) => (
          <div key={item.label} className="bg-bg-primary/50 rounded-lg px-3 py-2">
            <div className="text-text-secondary mb-0.5 text-[10px] uppercase tracking-wide">{item.label}</div>
            <div className="font-medium truncate">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="overflow-auto max-h-[220px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-bg-card z-10">
            <tr className="text-text-secondary border-b border-border">
              <th className="text-left py-2 pl-2 font-medium w-8" />
              <th className="text-left py-2 font-medium">Station</th>
              <th className="text-left py-2 font-medium">Sch. Arr.</th>
              <th className="text-left py-2 font-medium">Pred. Arr.</th>
              <th className="text-left py-2 font-medium">Delay</th>
              <th className="text-left py-2 font-medium hidden sm:table-cell">Platform</th>
              <th className="text-left py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {train.stations.map((station, idx) => {
              const isActive = station.status === 'arriving' || station.status === 'current';
              const isLast = idx === train.stations.length - 1;
              return (
                <tr
                  key={station.code}
                  className={`border-b border-border/50 ${isActive ? 'bg-accent-blue/5' : ''}`}
                >
                  <td className="py-0 w-8 align-top">
                    <div className="flex flex-col items-center py-2.5 h-full">
                      <div className="relative flex flex-col items-center flex-1">
                        {idx > 0 && <div className="w-px flex-1 bg-border min-h-[10px]" />}
                        <StationIcon status={station.status} />
                        {!isLast && <div className="w-px flex-1 bg-border min-h-[10px]" />}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <div className="font-medium">{station.name}</div>
                    <div className="text-text-secondary font-mono text-[10px]">{station.code}</div>
                  </td>
                  <td className="py-2.5 font-mono">{station.scheduledArrival}</td>
                  <td className="py-2.5 font-mono">{station.predictedArrival}</td>
                  <td
                    className={`py-2.5 font-mono font-medium ${
                      station.delay > 30
                        ? 'text-accent-red'
                        : station.delay > 0
                          ? 'text-accent-orange'
                          : 'text-accent-green'
                    }`}
                  >
                    {station.delay > 0 ? `+${station.delay} min` : '—'}
                  </td>
                  <td className="py-2.5 font-mono hidden sm:table-cell">{station.platform}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[10px] font-medium uppercase ${
                        station.status === 'departed'
                          ? 'text-accent-green'
                          : isActive
                            ? 'text-accent-yellow'
                            : 'text-text-secondary'
                      }`}
                    >
                      {statusLabel(station.status, station.predictedArrival)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
