import { useState, useEffect, useCallback, useRef } from 'react';
import type { Station, Train } from '../types';
import { baseTrains } from '../data/mockData';
import { generateCoaches } from '../data/coachData';

function initTrain(t: Omit<Train, 'coaches'> & { coaches?: Train['coaches'] }): Train {
  return { ...t, coaches: t.coaches ?? generateCoaches(t as Train) };
}

function parseTime(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function addMinutes(time: string, mins: number): string {
  return formatTime(parseTime(time) + mins);
}

function updateStationStatuses(stations: Station[], currentIndex: number): Station[] {
  return stations.map((s, i) => {
    if (i < currentIndex) return { ...s, status: 'departed' as const };
    if (i === currentIndex) return { ...s, status: 'arriving' as const };
    return { ...s, status: 'upcoming' as const };
  });
}

function simulateTrain(train: Train, tick: number): Train {
  const updated = structuredClone(train);
  const variance = tick % 3 === 0 ? 1 : 0;
  const delayChange = tick % 5 === 0 && Math.random() > 0.55 ? 1 : tick % 7 === 0 && Math.random() > 0.7 ? -1 : 0;

  updated.delay = Math.max(0, updated.delay + delayChange);
  updated.routeProgress = Math.min(0.98, (updated.routeProgress ?? 0.45) + 0.002 + variance * 0.001);

  const progressStations = Math.floor(updated.routeProgress * updated.stations.length);
  updated.currentStationIndex = Math.min(progressStations, updated.stations.length - 2);

  updated.stations = updated.stations.map((station, i) => {
    const stationDelay = Math.max(0, updated.delay + Math.max(0, i - updated.currentStationIndex) * 2);
    return {
      ...station,
      delay: stationDelay,
      predictedArrival: addMinutes(station.scheduledArrival, stationDelay),
      status: i < updated.currentStationIndex ? 'departed' : i === updated.currentStationIndex ? 'arriving' : 'upcoming',
    };
  });

  updated.stations = updateStationStatuses(updated.stations, updated.currentStationIndex);
  updated.predictedDeparture = addMinutes(updated.scheduledDeparture, updated.delay);
  updated.predictionConfidence = Math.max(65, Math.min(96, updated.predictionConfidence + (Math.random() > 0.5 ? 1 : -1)));
  updated.runningStatus = 'En Route';

  if (updated.delay === 0) {
    updated.boardStatus = 'ON TIME';
  } else if (updated.delay <= 5 && updated.currentStationIndex === 0) {
    updated.boardStatus = 'BOARDING';
  } else {
    updated.boardStatus = updated.currentStationIndex > 0 ? 'DEPARTED' : 'DELAYED';
  }

  updated.delayDrivers = updated.delayDrivers.map((d) => ({
    ...d,
    impact: Math.max(0, d.impact + (tick % 4 === 0 && d.impact > 0 ? (Math.random() > 0.6 ? 1 : 0) : 0)),
  }));

  if (updated.weather.etaImpact > 0 && tick % 6 === 0) {
    updated.weather = {
      ...updated.weather,
      temperature: updated.weather.temperature + (Math.random() > 0.5 ? 1 : -1),
      wind: Math.max(4, updated.weather.wind + (Math.random() > 0.5 ? 1 : -1)),
    };
  }

  return updated;
}

export function useLiveTrains() {
  const [trains, setTrains] = useState<Train[]>(() => baseTrains.map((t) => initTrain(t)));
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [countdown, setCountdown] = useState(30);
  const tickRef = useRef(0);

  const refresh = useCallback(() => {
    tickRef.current += 1;
    setTrains((prev) => prev.map((t) => simulateTrain(t, tickRef.current)));
    setLastUpdate(new Date());
    setCountdown(30);
  }, []);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          refresh();
          return 30;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, [refresh]);

  return { trains, lastUpdate, countdown, refresh };
}
