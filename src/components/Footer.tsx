import { Megaphone } from 'lucide-react';
import { systemMessages } from '../data/mockData';

interface FooterProps {
  countdown: number;
}

export default function Footer({ countdown }: FooterProps) {
  const messageIndex = Math.floor(Date.now() / 30000) % systemMessages.length;

  return (
    <footer className="bg-bg-card border-t border-border px-4 lg:px-6 py-2 flex items-center justify-between shrink-0 gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Megaphone className="w-4 h-4 text-accent-orange shrink-0" />
        <p className="text-xs text-text-secondary truncate">{systemMessages[messageIndex]}</p>
      </div>
      <div className="text-[10px] sm:text-xs text-text-secondary font-mono shrink-0">
        Next update in <span className="text-accent-green font-bold">{countdown}</span>s
      </div>
    </footer>
  );
}
