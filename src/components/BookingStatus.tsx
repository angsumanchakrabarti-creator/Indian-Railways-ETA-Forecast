import { Ticket, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IRCTC_URL = 'https://www.irctc.co.in/nget/train';

export default function BookingStatus() {
  const { user } = useAuth();

  if (!user) return null;

  if (!user.ticketBooked || !user.booking) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-orange/20 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <p className="text-sm font-semibold">No Ticket Booked</p>
            <p className="text-xs text-text-secondary">Book a ticket on IRCTC to track your journey</p>
          </div>
        </div>
        <a
          href={IRCTC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold bg-accent-green hover:bg-accent-green/90 text-white px-4 py-2 rounded-lg transition shrink-0"
        >
          Book Your Ticket
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  const { booking } = user;

  return (
    <div className="bg-bg-card border border-accent-green/30 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-accent-green" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent-green">Ticket Booked</p>
            <p className="text-xs text-text-secondary">PNR: <span className="font-mono font-medium text-text-primary">{booking.pnr}</span></p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase bg-accent-green/20 text-accent-green px-2 py-1 rounded">
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-bg-primary/50 rounded-lg px-3 py-2">
          <p className="text-text-secondary mb-0.5">Train</p>
          <p className="font-mono font-bold">{booking.trainNumber}</p>
          <p className="text-text-secondary truncate">{booking.trainName}</p>
        </div>
        <div className="bg-bg-primary/50 rounded-lg px-3 py-2">
          <p className="text-text-secondary mb-0.5">Route</p>
          <p className="font-medium">{booking.fromCode} → {booking.toCode}</p>
          <p className="text-text-secondary">{booking.travelDate}</p>
        </div>
        <div className="bg-bg-primary/50 rounded-lg px-3 py-2">
          <p className="text-text-secondary mb-0.5">Class / Seat</p>
          <p className="font-medium">{booking.class}</p>
          <p className="font-mono">{booking.seat}</p>
        </div>
        <div className="bg-bg-primary/50 rounded-lg px-3 py-2 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-accent-green shrink-0" />
          <div>
            <p className="text-text-secondary">Status</p>
            <p className="font-medium text-accent-green">Confirmed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
