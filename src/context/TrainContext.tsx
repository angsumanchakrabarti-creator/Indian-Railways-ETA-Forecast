import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { TrackedTrain, Train } from '../types';
import { findTrainByNumber } from '../data/mockData';
import { useLiveTrains } from '../hooks/useLiveTrains';
import { useAuth } from './AuthContext';

interface TrainContextType {
  selectedTrain: Train;
  trackedTrains: TrackedTrain[];
  selectTrain: (trainId: string) => void;
  addTrackedTrain: (trainNumber: string, pnr?: string, nickname?: string) => { success: boolean; message: string };
  removeTrackedTrain: (trainNumber: string) => void;
  allTrains: Train[];
  countdown: number;
  lastUpdate: Date;
  refresh: () => void;
}

const TrainContext = createContext<TrainContextType | null>(null);

export function TrainProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { trains, countdown, lastUpdate, refresh } = useLiveTrains();
  const [selectedTrainId, setSelectedTrainId] = useState('1');
  const [trackedTrains, setTrackedTrains] = useState<TrackedTrain[]>(() => {
    const stored = sessionStorage.getItem('railway-tracked');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!user?.ticketBooked || !user.booking) return;

    const bookingTrack: TrackedTrain = {
      trainNumber: user.booking.trainNumber,
      pnr: user.booking.pnr,
      nickname: 'My Booking',
      addedAt: new Date().toISOString(),
    };

    setTrackedTrains((prev) => {
      if (prev.some((t) => t.trainNumber === bookingTrack.trainNumber)) return prev;
      const next = [bookingTrack, ...prev];
      sessionStorage.setItem('railway-tracked', JSON.stringify(next));
      return next;
    });

    const bookedTrain = findTrainByNumber(user.booking.trainNumber);
    if (bookedTrain) setSelectedTrainId(bookedTrain.id);
  }, [user?.email]);

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) ?? trains[0];

  const selectTrain = useCallback((trainId: string) => {
    setSelectedTrainId(trainId);
  }, []);

  const persistTracked = useCallback((list: TrackedTrain[]) => {
    setTrackedTrains(list);
    sessionStorage.setItem('railway-tracked', JSON.stringify(list));
  }, []);

  const addTrackedTrain = useCallback(
    (trainNumber: string, pnr?: string, nickname?: string): { success: boolean; message: string } => {
      const train = findTrainByNumber(trainNumber, trains);
      if (!train) {
        return { success: false, message: `Train ${trainNumber} not found in the network.` };
      }
      if (trackedTrains.some((t) => t.trainNumber === trainNumber)) {
        return { success: false, message: `Train ${trainNumber} is already being tracked.` };
      }
      const entry: TrackedTrain = {
        trainNumber,
        pnr,
        nickname,
        addedAt: new Date().toISOString(),
      };
      persistTracked([...trackedTrains, entry]);
      setSelectedTrainId(train.id);
      return { success: true, message: `${train.name} (${trainNumber}) added to your tracking list.` };
    },
    [trackedTrains, persistTracked, trains],
  );

  const removeTrackedTrain = useCallback(
    (trainNumber: string) => {
      persistTracked(trackedTrains.filter((t) => t.trainNumber !== trainNumber));
    },
    [trackedTrains, persistTracked],
  );

  return (
    <TrainContext.Provider
      value={{
        selectedTrain,
        trackedTrains,
        selectTrain,
        addTrackedTrain,
        removeTrackedTrain,
        allTrains: trains,
        countdown,
        lastUpdate,
        refresh,
      }}
    >
      {children}
    </TrainContext.Provider>
  );
}

export function useTrains() {
  const ctx = useContext(TrainContext);
  if (!ctx) throw new Error('useTrains must be used within TrainProvider');
  return ctx;
}
