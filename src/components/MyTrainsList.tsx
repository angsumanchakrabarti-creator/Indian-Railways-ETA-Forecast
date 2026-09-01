import { RefreshCw } from 'lucide-react';
import { useTrains } from '../context/TrainContext';
import { getStatusColor, getDisplayBoardStatus } from '../data/mockData';

export default function MyTrainsList() {
  const { allTrains, selectedTrain, selectTrain, refresh } = useTrains();

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Available Trains
        </h3>
        <button
          onClick={refresh}
          className="p-1.5 rounded hover:bg-bg-card-hover text-text-secondary transition"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-secondary border-b border-border bg-bg-primary/30">
              <th className="text-left py-2.5 px-4 font-medium">Train No.</th>
              <th className="text-left py-2.5 px-4 font-medium">Name</th>
              <th className="text-left py-2.5 px-4 font-medium hidden sm:table-cell">Route</th>
              <th className="text-left py-2.5 px-4 font-medium">Sch. Dep.</th>
              <th className="text-left py-2.5 px-4 font-medium">Pred. Dep.</th>
              <th className="text-left py-2.5 px-4 font-medium">Delay</th>
              <th className="text-left py-2.5 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {allTrains.map((train) => {
              const isSelected = train.id === selectedTrain.id;
              const displayStatus = getDisplayBoardStatus(train.boardStatus, train.delay);
              return (
                <tr
                  key={train.id}
                  onClick={() => selectTrain(train.id)}
                  className={`border-b border-border/30 cursor-pointer transition hover:bg-bg-card-hover ${
                    isSelected ? 'bg-accent-green/5 border-l-2 border-l-accent-green' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-mono font-bold">{train.number}</td>
                  <td className="py-2.5 px-4">{train.name}</td>
                  <td className="py-2.5 px-4 font-mono hidden sm:table-cell">
                    {train.fromCode} → {train.toCode}
                  </td>
                  <td className="py-2.5 px-4 font-mono">{train.scheduledDeparture}</td>
                  <td className="py-2.5 px-4 font-mono">{train.predictedDeparture}</td>
                  <td
                    className={`py-2.5 px-4 font-mono font-bold ${
                      train.delay > 30
                        ? 'text-accent-red'
                        : train.delay > 0
                          ? 'text-accent-orange'
                          : 'text-accent-green'
                    }`}
                  >
                    {train.delay > 0 ? `+${train.delay} min` : '—'}
                  </td>
                  <td className={`py-2.5 px-4 font-bold ${getStatusColor(displayStatus, train.delay)}`}>
                    {displayStatus}
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
