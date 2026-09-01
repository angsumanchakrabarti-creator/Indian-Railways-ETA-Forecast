import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Armchair, Bot, LocateFixed, Send, Sparkles, TrainFront, UserRound } from 'lucide-react';
import type { Train } from '../types';
import { answerRailwayQuestion } from '../data/railwayAssistant';

type ChatMessage = { role: 'assistant' | 'user'; text: string };
const quickQuestions = ['Where is this train?', 'What is the ETA?', 'Show the route', 'Which cities are covered?'];

interface RailwayAssistantProps {
  train: Train;
  trains: Train[];
  onSelectTrain: (id: string) => void;
  onLocateCoach: (coach: string, seat: string) => void;
}

export default function RailwayAssistant({ train, trains, onSelectTrain, onLocateCoach }: RailwayAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: `Hi, I’m Railway Assistant. Ask about ${train.number} ${train.name}, another train number, ETA, route, or network cities.` }]);
  const [question, setQuestion] = useState('');
  const coaches = useMemo(() => train.coaches ?? [], [train]);
  const [coach, setCoach] = useState('');
  const [seat, setSeat] = useState('');
  const [seatStatus, setSeatStatus] = useState<{ coach: string; seat: string; booked: boolean } | null>(null);

  useEffect(() => { setCoach(coaches[0]?.id ?? ''); setSeat(''); setSeatStatus(null); }, [train.id, coaches]);

  const ask = (value: string) => {
    const prompt = value.trim();
    if (!prompt) return;
    const reply = answerRailwayQuestion(prompt, train, trains);
    setMessages((previous) => [...previous, { role: 'user', text: prompt }, { role: 'assistant', text: reply.text }]);
    setQuestion('');
  };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); ask(question); };
  const locateSeat = () => {
    const normalizedSeat = seat.trim();
    if (!coach || !normalizedSeat) { setMessages((previous) => [...previous, { role: 'assistant', text: 'Select a coach and enter a seat number first.' }]); return; }
    if (!/^\d{1,3}[A-Z]?$/i.test(normalizedSeat)) { setMessages((previous) => [...previous, { role: 'assistant', text: 'Use a seat number such as 42 or 42U.' }]); return; }
    const booked = Math.random() >= 0.5;
    setSeatStatus({ coach, seat: normalizedSeat, booked });
    onLocateCoach(coach, normalizedSeat);
    setMessages((previous) => [...previous, { role: 'assistant', text: `Coach ${coach}, seat ${normalizedSeat} is ${booked ? 'currently marked Booked' : 'currently marked Available'}. This result is randomly simulated and is not a real reservation check.` }]);
  };

  return (
    <section className="bg-bg-card border border-border rounded-xl flex flex-col h-[510px] overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent-blue/15 text-accent-blue flex items-center justify-center"><Bot className="w-4 h-4" /></div>
        <div><h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Railway Assistant</h3><p className="text-[10px] text-accent-green">● Network guide</p></div>
      </div>

      <div className="px-3 py-3 border-b border-border bg-bg-primary/30 shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-text-secondary mb-2"><TrainFront className="w-3 h-3" /> Journey options</div>
        <select value={train.id} onChange={(event) => onSelectTrain(event.target.value)} className="w-full bg-bg-primary border border-border rounded-lg px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-accent-blue/50 mb-2">
          {trains.map((item) => <option key={item.id} value={item.id}>{item.number} · {item.name}</option>)}
        </select>
        <div className="grid grid-cols-[1fr_0.7fr_auto] gap-1.5">
          <select value={coach} onChange={(event) => setCoach(event.target.value)} className="min-w-0 bg-bg-primary border border-border rounded-lg px-2 py-2 text-xs font-mono focus:outline-none focus:border-accent-blue/50">
            {coaches.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
          </select>
          <input value={seat} onChange={(event) => setSeat(event.target.value.toUpperCase())} maxLength={4} placeholder="Seat" className="min-w-0 bg-bg-primary border border-border rounded-lg px-2 py-2 text-xs font-mono focus:outline-none focus:border-accent-blue/50" />
          <button type="button" onClick={locateSeat} disabled={!coach} className="rounded-lg bg-accent-green text-white px-2 py-2 text-[10px] font-semibold hover:bg-accent-green/90 disabled:opacity-50"><LocateFixed className="w-3.5 h-3.5" /></button>
        </div>
        <p className={`mt-1.5 flex items-center gap-1 text-[9px] ${seatStatus ? (seatStatus.booked ? 'text-accent-red' : 'text-accent-green') : 'text-text-secondary'}`}><Armchair className="w-2.5 h-2.5" /> {seatStatus ? `${seatStatus.coach} / Seat ${seatStatus.seat}: ${seatStatus.booked ? 'Booked' : 'Available'} (simulated)` : 'Select a coach and seat, then locate it.'}</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && <Bot className="w-4 h-4 text-accent-blue mt-1 shrink-0" />}
            <p className={`max-w-[88%] rounded-lg px-3 py-2 text-[11px] leading-relaxed ${message.role === 'user' ? 'bg-accent-green/15 text-text-primary border border-accent-green/20' : 'bg-bg-primary text-text-secondary border border-border'}`}>{message.text}</p>
            {message.role === 'user' && <UserRound className="w-4 h-4 text-accent-green mt-1 shrink-0" />}
          </div>
        ))}
      </div>

      <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
        {quickQuestions.map((item) => <button key={item} type="button" onClick={() => ask(item)} className="text-[10px] text-accent-blue bg-accent-blue/10 border border-accent-blue/20 hover:bg-accent-blue/20 rounded-full px-2 py-1 transition"><Sparkles className="w-2.5 h-2.5 inline mr-1" />{item}</button>)}
      </div>
      <form onSubmit={submit} className="p-3 border-t border-border flex gap-2 shrink-0">
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a train or route…" className="min-w-0 flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent-blue/50" />
        <button type="submit" aria-label="Send question" className="w-9 h-9 shrink-0 rounded-lg bg-accent-blue text-white flex items-center justify-center hover:bg-accent-blue/90 transition"><Send className="w-4 h-4" /></button>
      </form>
    </section>
  );
}

