import { useState } from 'react';
import { X, Search, Train, Bookmark, Trash2 } from 'lucide-react';
import { useTrains } from '../context/TrainContext';

interface TrackTrainModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TrackTrainModal({ open, onClose }: TrackTrainModalProps) {
  const { trackedTrains, addTrackedTrain, removeTrackedTrain, selectTrain, allTrains } = useTrains();
  const [trainNumber, setTrainNumber] = useState('');
  const [pnr, setPnr] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!open) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addTrackedTrain(trainNumber.trim(), pnr.trim() || undefined, nickname.trim() || undefined);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
      setTrainNumber('');
      setPnr('');
      setNickname('');
    }
  };

  const handleSelectTracked = (num: string) => {
    const train = allTrains.find((t) => t.number === num);
    if (train) {
      selectTrain(train.id);
      onClose();
    }
  };

  const filteredTrains = allTrains.filter(
    (t) =>
      t.number.includes(searchQuery) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fromCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in">
      <div className="bg-bg-card border border-border rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent-green" />
            <h2 className="text-lg font-bold">Track a Train</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-card-hover text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Add train form */}
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Train Number *</label>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="e.g. 12345"
                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-green/50 font-mono"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">PNR (Optional)</label>
                <input
                  type="text"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  placeholder="10-digit PNR"
                  className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-green/50 font-mono"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="My Journey"
                  className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent-green/50"
                />
              </div>
            </div>

            {message && (
              <div
                className={`text-xs px-3 py-2 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                    : 'bg-accent-red/10 text-accent-red border border-accent-red/20'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-accent-green hover:bg-accent-green/90 text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
              Add to Tracking List
            </button>
          </form>

          {/* My tracked trains */}
          {trackedTrains.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                My Tracked Trains
              </h3>
              <div className="space-y-2">
                {trackedTrains.map((tracked) => {
                  const train = allTrains.find((t) => t.number === tracked.trainNumber);
                  return (
                    <div
                      key={tracked.trainNumber}
                      className="flex items-center justify-between bg-bg-primary/50 border border-border rounded-lg px-4 py-3"
                    >
                      <button
                        onClick={() => handleSelectTracked(tracked.trainNumber)}
                        className="flex items-center gap-3 text-left flex-1"
                      >
                        <Train className="w-4 h-4 text-accent-green shrink-0" />
                        <div>
                          <div className="text-sm font-mono font-bold">{tracked.trainNumber}</div>
                          <div className="text-xs text-text-secondary">
                            {tracked.nickname ?? train?.name ?? 'Unknown Train'}
                            {tracked.pnr && ` · PNR: ${tracked.pnr}`}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => removeTrackedTrain(tracked.trainNumber)}
                        className="p-1.5 rounded hover:bg-accent-red/10 text-text-secondary hover:text-accent-red transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick search */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Browse Network
            </h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by number, name, or station..."
                className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-green/50"
              />
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {filteredTrains.map((train) => (
                <button
                  key={train.id}
                  onClick={() => {
                    selectTrain(train.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-card-hover transition text-left text-xs"
                >
                  <span className="font-mono font-bold">{train.number}</span>
                  <span className="text-text-secondary">{train.name}</span>
                  <span className="text-text-secondary font-mono">
                    {train.fromCode} → {train.toCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
