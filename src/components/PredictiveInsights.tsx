import { CloudRain, Wind, Droplets, Eye } from 'lucide-react';
import type { Train } from '../types';
import RailwayAssistant from './RailwayAssistant';

interface PredictiveInsightsProps {
  train: Train;
  trains: Train[];
  onSelectTrain: (id: string) => void;
  onLocateCoach: (coach: string, seat: string) => void;
}

export default function PredictiveInsights({ train, trains, onSelectTrain, onLocateCoach }: PredictiveInsightsProps) {
  const activeDrivers = train.delayDrivers.filter((driver) => driver.impact > 0);
  const maxImpact = Math.max(...activeDrivers.map((driver) => driver.impact), 1);
  const confidenceLabel = train.predictionConfidence >= 80 ? 'High' : train.predictionConfidence >= 60 ? 'Medium' : 'Low';
  const confidenceColor = train.predictionConfidence >= 80 ? 'text-accent-green' : train.predictionConfidence >= 60 ? 'text-accent-orange' : 'text-accent-red';

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-bg-card border border-border rounded-xl p-4 shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Delay Drivers</h3>
        {activeDrivers.length === 0 ? <p className="text-xs text-accent-green">No delay factors detected. Train on schedule.</p> : <div className="space-y-3">{activeDrivers.map((driver) => <div key={driver.name}><div className="flex justify-between text-xs mb-1"><span className="text-text-secondary">{driver.name}</span><span className="font-mono font-medium" style={{ color: driver.color }}>+{driver.impact} min</span></div><div className="h-2 bg-bg-primary rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${(driver.impact / maxImpact) * 100}%`, backgroundColor: driver.color }} /></div></div>)}</div>}
      </div>
      <div className="bg-bg-card border border-border rounded-xl p-4 shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Weather (En Route)</h3>
        <div className="flex items-center gap-3 mb-3"><CloudRain className="w-8 h-8 text-accent-blue" /><div><div className="text-2xl font-bold">{train.weather.temperature}°C</div><div className="text-xs text-text-secondary">{train.weather.condition}</div></div></div>
        <div className="grid grid-cols-3 gap-2 text-[10px] text-text-secondary mb-3"><div className="flex items-center gap-1"><Wind className="w-3 h-3" />{train.weather.wind} km/h</div><div className="flex items-center gap-1"><Droplets className="w-3 h-3" />{train.weather.humidity}%</div><div className="flex items-center gap-1"><Eye className="w-3 h-3" />{train.weather.visibility} km</div></div>
        <div className="text-xs bg-accent-orange/10 border border-accent-orange/20 rounded-lg px-3 py-2">Impact on ETA: <span className="font-mono font-bold text-accent-orange">{train.weather.etaImpact > 0 ? `+${train.weather.etaImpact} min` : 'None'}</span></div>
      </div>
      <RailwayAssistant train={train} trains={trains} onSelectTrain={onSelectTrain} onLocateCoach={onLocateCoach} />
      <div className="bg-bg-card border border-border rounded-xl p-4 shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Prediction Confidence</h3>
        <div className="flex items-center justify-between mb-2"><span className={`text-lg font-bold ${confidenceColor}`}>{confidenceLabel}</span><span className="text-2xl font-bold font-mono">{train.predictionConfidence}%</span></div>
        <div className="h-2.5 bg-bg-primary rounded-full overflow-hidden mb-2"><div className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-green/70 transition-all duration-700" style={{ width: `${train.predictionConfidence}%` }} /></div>
        <p className="text-[10px] text-text-secondary">Model updated 2 min ago</p>
      </div>
    </div>
  );
}
