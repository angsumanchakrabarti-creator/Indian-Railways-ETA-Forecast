import { useState } from 'react';
import Header from '../components/Header';
import BookingStatus from '../components/BookingStatus';
import CorridorMap from '../components/CorridorMap';
import TrainDetails from '../components/TrainDetails';
import CheckboardHistory from '../components/CheckboardHistory';
import PredictiveInsights from '../components/PredictiveInsights';
import MyTrainsList from '../components/MyTrainsList';
import Footer from '../components/Footer';
import { useTrains } from '../context/TrainContext';
import { useAuth } from '../context/AuthContext';
import type { CheckboardDay } from '../types';

function parseCoachFromSeat(seat?: string): string | undefined {
  const match = seat?.match(/([A-Z]+\d+)/i);
  return match ? match[1].toUpperCase() : undefined;
}

export default function DashboardPage() {
  const { selectedTrain, allTrains, selectTrain, countdown, lastUpdate, refresh } = useTrains();
  const { user } = useAuth();
  const [locatedCoach, setLocatedCoach] = useState<string | undefined>();
  const [checkboardDay, setCheckboardDay] = useState<CheckboardDay>('today');
  const bookedCoach = user?.booking?.trainNumber === selectedTrain.number ? parseCoachFromSeat(user.booking.seat) : undefined;
  const highlightCoach = locatedCoach ?? bookedCoach;

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <Header checkboardDay={checkboardDay} trains={allTrains} onSelectTrain={(id) => { selectTrain(id); setLocatedCoach(undefined); }} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 space-y-4">
          <BookingStatus />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5"><CorridorMap train={selectedTrain} lastUpdate={lastUpdate} onRefresh={refresh} /></div>
            <div className="lg:col-span-7"><TrainDetails train={selectedTrain} /></div>
          </div>
          <CheckboardHistory train={selectedTrain} highlightCoach={highlightCoach} activeDay={checkboardDay} onDayChange={setCheckboardDay} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8"><MyTrainsList /></div>
            <div className="lg:col-span-4"><PredictiveInsights train={selectedTrain} trains={allTrains} onSelectTrain={(id) => { selectTrain(id); setLocatedCoach(undefined); }} onLocateCoach={(coach) => setLocatedCoach(coach)} /></div>
          </div>
        </div>
      </main>
      <Footer countdown={countdown} />
    </div>
  );
}

