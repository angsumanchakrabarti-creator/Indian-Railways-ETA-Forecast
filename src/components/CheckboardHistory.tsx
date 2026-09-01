import { CalendarArrowDown, CalendarCheck, CalendarArrowUp } from 'lucide-react';
import type { CheckboardDay, Train } from '../types';
import { getCheckboardRecord } from '../data/coachData';
import CoachPosition from './CoachPosition';
import { formatDelay } from '../data/mockData';

interface CheckboardHistoryProps {
  train: Train;
  highlightCoach?: string;
  activeDay: CheckboardDay;
  onDayChange: (day: CheckboardDay) => void;
}

const dayTabs: { day: CheckboardDay; label: string; icon: typeof CalendarCheck }[] = [
  { day: 'yesterday', label: 'Yesterday Checkboard', icon: CalendarArrowDown },
  { day: 'today', label: 'Today Checkboard', icon: CalendarCheck },
  { day: 'tomorrow', label: 'Further Checkboards', icon: CalendarArrowUp },
];

export default function CheckboardHistory({ train, highlightCoach, activeDay, onDayChange }: CheckboardHistoryProps) {
  const record = getCheckboardRecord(train, activeDay);

  return (
    <div className="space-y-4">
      {/* Day switcher icons */}
      <div className="flex items-center gap-2 flex-wrap">
        {dayTabs.map(({ day, label, icon: Icon }) => {
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              title={label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition ${
                isActive
                  ? 'bg-accent-green/15 border-accent-green/40 text-accent-green'
                  : 'bg-bg-card border-border text-text-secondary hover:border-accent-green/30 hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{day === 'yesterday' ? 'Yesterday' : day === 'tomorrow' ? 'Further' : 'Today'}</span>
            </button>
          );
        })}
        <span className="ml-auto text-[10px] text-text-secondary font-mono">{record.label}</span>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { label: 'Date', value: record.date },
          { label: 'Delay', value: record.delay > 0 ? formatDelay(record.delay) : 'On Time', color: record.delay > 30 ? 'text-accent-red' : record.delay > 0 ? 'text-accent-orange' : 'text-accent-green' },
          { label: 'Punctuality', value: `${record.punctuality}%` },
          { label: 'Status', value: record.runningStatus },
        ].map((item) => (
          <div key={item.label} className="bg-bg-card border border-border rounded-lg px-3 py-2">
            <p className="text-text-secondary text-[10px] uppercase tracking-wide mb-0.5">{item.label}</p>
            <p className={`font-medium font-mono ${item.color ?? ''}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <CoachPosition coaches={record.coaches} highlightCoach={highlightCoach} />

      {/* Checkboard station records */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {activeDay === 'yesterday' ? 'Yesterday' : activeDay === 'tomorrow' ? 'Scheduled' : 'Live'} Checkboard — {train.number} {train.name}
          </h3>
        </div>
        <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-bg-card z-10">
              <tr className="text-text-secondary border-b border-border">
                <th className="text-left py-2 px-4 font-medium">Station</th>
                <th className="text-left py-2 px-4 font-medium">Sch. Arr.</th>
                <th className="text-left py-2 px-4 font-medium">
                  {activeDay === 'yesterday' ? 'Actual Arr.' : activeDay === 'tomorrow' ? 'Est. Arr.' : 'Pred. Arr.'}
                </th>
                <th className="text-left py-2 px-4 font-medium">Delay</th>
                <th className="text-left py-2 px-4 font-medium hidden sm:table-cell">Platform</th>
              </tr>
            </thead>
            <tbody>
              {record.stations.map((station) => (
                <tr key={station.code} className="border-b border-border/30">
                  <td className="py-2 px-4">
                    <div className="font-medium">{station.name}</div>
                    <div className="text-text-secondary font-mono text-[10px]">{station.code}</div>
                  </td>
                  <td className="py-2 px-4 font-mono">{station.scheduledArrival}</td>
                  <td className="py-2 px-4 font-mono">{station.actualArrival}</td>
                  <td
                    className={`py-2 px-4 font-mono font-bold ${
                      station.delay > 30
                        ? 'text-accent-red'
                        : station.delay > 0
                          ? 'text-accent-orange'
                          : 'text-accent-green'
                    }`}
                  >
                    {station.delay > 0 ? `+${station.delay} min` : '—'}
                  </td>
                  <td className="py-2 px-4 font-mono hidden sm:table-cell">{station.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

