import type { CheckboardDay, CheckboardRecord, CoachBlock, CoachBlockType, Train } from '../types';

const COACH_PALETTES: Record<string, string[]> = {
  Rajdhani: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'PC', 'E1', 'E2', 'SLR'],
  Shatabdi: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'PC', 'A1', 'A2', 'GEN', 'SLR'],
  Duronto: ['A1', 'A2', 'B1', 'B2', 'B3', 'S1', 'S2', 'S3', 'S4', 'S5', 'PC', 'GEN', 'SLR'],
  Superfast: ['A1', 'A2', 'B1', 'B2', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'GEN', 'SLR', 'H1'],
  Express: ['A1', 'A2', 'B1', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'GEN', 'SLR'],
  Passenger: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'GEN', 'SLR', 'H1'],
};

function coachType(id: string): CoachBlockType {
  if (id.startsWith('A') || id.startsWith('B') || id.startsWith('C')) return id.startsWith('C') ? 'Chair' : 'AC';
  if (id.startsWith('S')) return 'Sleeper';
  if (id === 'PC') return 'Pantry';
  if (id === 'SLR' || id === 'H1') return 'Luggage';
  return 'General';
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateCoaches(train: Train): CoachBlock[] {
  const palette = COACH_PALETTES[train.type] ?? COACH_PALETTES.Express;
  const seed = parseInt(train.number, 10) || 1;

  return palette.map((id, index) => {
    const rand = seededRandom(seed + index * 17);
    let status: CoachBlock['status'] = 'occupied';
    if (rand > 0.92) status = 'maintenance';
    else if (rand > 0.85) status = 'available';

    return {
      id,
      type: coachType(id),
      status,
      position: index + 1,
    };
  });
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = ((h * 60 + m + mins) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function dateLabel(day: CheckboardDay, date: Date): string {
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const formatted = date.toLocaleDateString('en-IN', opts);
  if (day === 'yesterday') return `Yesterday · ${formatted}`;
  if (day === 'tomorrow') return `Tomorrow · ${formatted}`;
  return `Today · ${formatted}`;
}

function dayOffsetDelay(train: Train, day: CheckboardDay): number {
  const seed = parseInt(train.number, 10) || 1;
  switch (day) {
    case 'yesterday':
      return Math.max(0, train.delay + Math.round(seededRandom(seed + 1) * 20 - 8));
    case 'tomorrow':
      return Math.max(0, Math.round(train.delay * 0.6 + seededRandom(seed + 2) * 10 - 3));
    default:
      return train.delay;
  }
}

export function getCheckboardRecord(train: Train, day: CheckboardDay, referenceDate = new Date()): CheckboardRecord {
  const date = new Date(referenceDate);
  if (day === 'yesterday') date.setDate(date.getDate() - 1);
  if (day === 'tomorrow') date.setDate(date.getDate() + 1);

  const delay = dayOffsetDelay(train, day);
  const coaches = generateCoaches(train).map((c, i) => {
    const seed = parseInt(train.number, 10) + i + (day === 'yesterday' ? 3 : day === 'tomorrow' ? 7 : 0);
    const rand = seededRandom(seed);
    if (day === 'yesterday' && rand > 0.9) return { ...c, status: 'maintenance' as const };
    return c;
  });

  const stations: CheckboardRecord['stations'] = train.stations.map((s, i) => {
    const stationDelay =
      day === 'today'
        ? s.delay
        : Math.max(0, delay + Math.round((i - train.currentStationIndex) * (day === 'yesterday' ? 1.5 : 0.8)));
    return {
      code: s.code,
      name: s.name,
      scheduledArrival: s.scheduledArrival,
      actualArrival: addMinutes(s.scheduledArrival, stationDelay),
      delay: stationDelay,
      platform: s.platform,
    };
  });

  const punctuality = Math.max(55, Math.min(99, 100 - delay * 1.2 - (day === 'yesterday' ? 5 : 0)));

  let runningStatus = train.runningStatus;
  let boardStatus = train.boardStatus;
  if (day === 'yesterday') {
    runningStatus = 'Terminated';
    boardStatus = delay > 0 ? 'DELAYED' : 'DEPARTED';
  } else if (day === 'tomorrow') {
    runningStatus = 'Scheduled';
    boardStatus = delay > 0 ? 'DELAYED' : 'ON TIME';
  }

  return {
    date: formatDate(date),
    day,
    label: dateLabel(day, date),
    delay,
    runningStatus,
    boardStatus,
    stations,
    coaches,
    punctuality: Math.round(punctuality),
  };
}

export function getAllCheckboardRecords(train: Train, referenceDate = new Date()): CheckboardRecord[] {
  return (['yesterday', 'today', 'tomorrow'] as CheckboardDay[]).map((day) =>
    getCheckboardRecord(train, day, referenceDate),
  );
}
