import { useEffect, useMemo, useState } from 'react';
import { Armchair, LocateFixed, TrainFront } from 'lucide-react';
import type { Train } from '../types';

interface JourneyControlsProps {
  train: Train;
  trains: Train[];
  onSelectTrain: (id: string) => void;
  onLocateCoach: (coach: string, seat: string) => void;
}

export default function JourneyControls({ train, trains, onSelectTrain, onLocateCoach }: JourneyControlsProps) {
  const availableCoaches = useMemo(() => train.coaches ?? [], [train]);
  const [coach, setCoach] = useState('');
  const [seat, setSeat] = useState('');
  const [notice, setNotice] = useState('Coach status and seat position are simulated for this demo.');

  useEffect(() => {
    setCoach(availableCoaches[0]?.id ?? '');
    setSeat('');
    setNotice('Coach status and seat position are simulated for this demo.');
  }, [train.id, availableCoaches]);

  const locate = () => {
    if (!coach) return;
    const normalizedSeat = seat.trim();
    if (normalizedSeat && !/^\d{1,3}[A-Z]?$/i.test(normalizedSeat)) {
      setNotice('Enter a seat number such as 42 or 42U.');
      return;
    }
    onLocateCoach(coach, normalizedSeat);
    setNotice(`Showing coach ${coach}${normalizedSeat ? `, seat ${normalizedSeat}` : ''} in the coach-position view.`);
  };

  return (
    <section className="bg-bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrainFront className="w-4 h-4 text-accent-green" />
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Journey Controls</h3>
          <p className="text-[10px] text-text-secondary">Switch trains or locate a coach and seat</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="block text-[10px] uppercase tracking-wide text-text-secondary mb-1">View train details</span>
          <select value={train.id} onChange={(event) => onSelectTrain(event.target.value)} className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-green/50">
            {trains.map((item) => <option key={item.id} value={item.id}>{item.number} · {item.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="block text-[10px] uppercase tracking-wide text-text-secondary mb-1">Coach position</span>
          <select value={coach} onChange={(event) => setCoach(event.target.value)} className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-green/50">
            {availableCoaches.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.type}</option>)}
          </select>
        </label>
        <div>
          <span className="block text-[10px] uppercase tracking-wide text-text-secondary mb-1">Seat number</span>
          <div className="flex gap-2">
            <input value={seat} onChange={(event) => setSeat(event.target.value.toUpperCase())} placeholder="e.g. 42" maxLength={4} className="min-w-0 flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-green/50" />
            <button type="button" onClick={locate} disabled={!coach} className="shrink-0 flex items-center gap-1.5 rounded-lg bg-accent-green text-white px-3 py-2 text-xs font-semibold hover:bg-accent-green/90 disabled:opacity-50 transition"><LocateFixed className="w-3.5 h-3.5" /> Locate</button>
          </div>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-text-secondary"><Armchair className="w-3 h-3" /> {notice}</p>
    </section>
  );
}
