import { useState, useEffect, useMemo, useRef } from 'react';
import { Train, Clock, CalendarDays, LogOut, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CheckboardDay, Train as TrainType } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  checkboardDay: CheckboardDay;
  trains: TrainType[];
  onSelectTrain: (id: string) => void;
}

export default function Header({ checkboardDay, trains, onSelectTrain }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) setShowUserMenu(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return trains.filter((train) => [train.number, train.name, train.type, train.from, train.to, train.fromCode, train.toCode, ...train.stations.flatMap((station) => [station.name, station.code])].some((value) => value.toLowerCase().includes(term))).slice(0, 6);
  }, [query, trains]);

  const displayDate = new Date(time);
  displayDate.setDate(displayDate.getDate() + (checkboardDay === 'yesterday' ? -1 : checkboardDay === 'tomorrow' ? 1 : 0));
  const handleLogout = () => { setShowUserMenu(false); logout(); navigate('/'); };
  const chooseTrain = (id: string) => { onSelectTrain(id); setQuery(''); setShowResults(false); };

  return (
    <header className="bg-bg-card border-b border-border px-4 lg:px-6 py-3 flex items-center gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-accent-green/20 flex items-center justify-center shrink-0"><Train className="w-5 h-5 text-accent-green" /></div>
        <div className="min-w-0"><h1 className="text-sm font-bold truncate">Train ETA Tracker</h1><p className="text-[10px] text-text-secondary hidden lg:block">Live arrival predictions</p></div>
      </div>

      <div className="hidden sm:block relative flex-1 max-w-xl" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        <input value={query} onFocus={() => setShowResults(true)} onChange={(event) => { setQuery(event.target.value); setShowResults(true); }} placeholder="Search train number, name, city or station…" className="w-full bg-bg-primary border border-border rounded-lg pl-9 pr-9 py-2 text-xs focus:outline-none focus:border-accent-green/50" />
        {query && <button type="button" onClick={() => { setQuery(''); setShowResults(false); }} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-text-primary"><X className="w-3.5 h-3.5" /></button>}
        {showResults && query && <div className="absolute z-50 top-full mt-1 w-full overflow-hidden rounded-lg border border-border bg-bg-card shadow-xl">
          {results.length > 0 ? results.map((train) => <button key={train.id} type="button" onClick={() => chooseTrain(train.id)} className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-bg-card-hover border-b border-border/50 last:border-b-0"><span><span className="font-mono text-xs font-bold mr-2">{train.number}</span><span className="text-xs">{train.name}</span></span><span className="text-[10px] font-mono text-text-secondary shrink-0">{train.fromCode} → {train.toCode}</span></button>) : <p className="px-3 py-3 text-xs text-text-secondary">No matching train, city, or station in this network.</p>}
        </div>}
      </div>

      <div className="ml-auto flex items-center gap-3 shrink-0">
        <div className="hidden xl:flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" /><span className="text-accent-green font-semibold">LIVE</span></div>
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-text-secondary"><CalendarDays className="w-4 h-4" />{displayDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        <div className="flex items-center gap-1.5 text-sm font-mono text-text-secondary"><Clock className="w-4 h-4" />{time.toLocaleTimeString('en-IN', { hour12: false })}</div>
        <div className="relative" ref={userRef}>
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue text-xs font-bold flex items-center justify-center hover:bg-accent-blue/30 transition">{user?.initials ?? 'U'}</button>
          {showUserMenu && <div className="absolute right-0 top-full mt-1 bg-bg-card border border-border rounded-lg shadow-xl z-50 min-w-[200px]"><div className="px-4 py-3 border-b border-border"><p className="text-sm font-medium">{user?.name}</p><p className="text-xs text-text-secondary">{user?.email}</p></div><button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-accent-red hover:bg-bg-card-hover transition"><LogOut className="w-3 h-3" />Sign Out</button></div>}
        </div>
      </div>
    </header>
  );
}
