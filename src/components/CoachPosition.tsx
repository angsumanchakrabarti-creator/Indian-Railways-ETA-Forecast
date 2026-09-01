import type { CoachBlock, CoachBlockType } from '../types';

const typeColors: Record<CoachBlockType, string> = {
  AC: 'bg-accent-blue/20 border-accent-blue/40 text-accent-blue',
  Chair: 'bg-accent-blue/15 border-accent-blue/30 text-accent-blue',
  Sleeper: 'bg-accent-green/15 border-accent-green/30 text-accent-green',
  General: 'bg-bg-primary border-border text-text-secondary',
  Pantry: 'bg-accent-orange/15 border-accent-orange/30 text-accent-orange',
  Luggage: 'bg-text-secondary/10 border-border text-text-secondary',
};

const statusDot: Record<CoachBlock['status'], string> = {
  occupied: 'bg-accent-green',
  available: 'bg-accent-blue',
  maintenance: 'bg-accent-red',
};

interface CoachPositionProps {
  coaches: CoachBlock[];
  highlightCoach?: string;
}

export default function CoachPosition({ coaches, highlightCoach }: CoachPositionProps) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Coach Position
        </h3>
        <div className="flex gap-3 text-[10px] text-text-secondary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-green" /> Occupied</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-blue" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-red" /> Maintenance</span>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {/* Engine */}
        <div className="shrink-0 w-12 h-14 rounded-lg bg-accent-orange/20 border border-accent-orange/40 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-accent-orange">ENG</span>
          <span className="text-[7px] text-text-secondary">Loco</span>
        </div>

        <div className="w-px h-10 bg-border shrink-0" />

        {coaches.map((coach) => {
          const isHighlighted = highlightCoach && coach.id === highlightCoach;
          return (
            <div
              key={coach.id}
              className={`shrink-0 w-11 h-14 rounded-lg border flex flex-col items-center justify-center relative transition ${
                typeColors[coach.type]
              } ${isHighlighted ? 'ring-2 ring-accent-yellow ring-offset-1 ring-offset-bg-card' : ''}`}
              title={`${coach.id} · ${coach.type} · ${coach.status}`}
            >
              <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${statusDot[coach.status]}`} />
              <span className="text-[10px] font-bold font-mono">{coach.id}</span>
              <span className="text-[7px] opacity-70 capitalize">{coach.type}</span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-text-secondary mt-2">
        {coaches.length} coaches · Front (ENG) → Rear (SLR)
      </p>
    </div>
  );
}
