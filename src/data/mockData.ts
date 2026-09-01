import type { CorridorSegment, CorridorStation, StationStatus, Train } from '../types';

/** Simulated 16-city Indian Railways network for ETA demonstrations. */
export const corridorStations: CorridorStation[] = [
  { name: 'New Delhi', code: 'NDLS', x: 120, y: 24, km: 0 },
  { name: 'Ghaziabad', code: 'GZB', x: 165, y: 34, km: 25 },
  { name: 'Kanpur Central', code: 'CNB', x: 280, y: 50, km: 440 },
  { name: 'Prayagraj Junction', code: 'PRYJ', x: 370, y: 57, km: 635 },
  { name: 'Patna Junction', code: 'PNBE', x: 505, y: 62, km: 1098 },
  { name: 'Howrah', code: 'HWH', x: 825, y: 67, km: 1445 },
  { name: 'Ajmer Junction', code: 'AII', x: 145, y: 105, km: 390 },
  { name: 'Vadodara Junction', code: 'BRC', x: 100, y: 145, km: 1000 },
  { name: 'Mumbai Central', code: 'MMCT', x: 58, y: 190, km: 1384 },
  { name: 'Pune Junction', code: 'PUNE', x: 145, y: 210, km: 1548 },
  { name: 'Bhopal Junction', code: 'BPL', x: 292, y: 122, km: 707 },
  { name: 'Nagpur Junction', code: 'NGP', x: 415, y: 150, km: 1093 },
  { name: 'Secunderabad', code: 'SC', x: 510, y: 185, km: 1664 },
  { name: 'Vijayawada Junction', code: 'BZA', x: 635, y: 174, km: 2015 },
  { name: 'Chennai Central', code: 'MAS', x: 748, y: 202, km: 2180 },
  { name: 'Bengaluru City', code: 'SBC', x: 665, y: 232, km: 2365 },
];

export const corridorSegments: CorridorSegment[] = [
  { from: 'New Delhi', to: 'Ghaziabad', fromCode: 'NDLS', toCode: 'GZB', status: 'on-time', delayMinutes: 0, distance: 25 },
  { from: 'Ghaziabad', to: 'Kanpur Central', fromCode: 'GZB', toCode: 'CNB', status: 'minor', delayMinutes: 12, distance: 415 },
  { from: 'Kanpur Central', to: 'Prayagraj Junction', fromCode: 'CNB', toCode: 'PRYJ', status: 'minor', delayMinutes: 18, distance: 195 },
  { from: 'Prayagraj Junction', to: 'Patna Junction', fromCode: 'PRYJ', toCode: 'PNBE', status: 'major', delayMinutes: 34, distance: 463 },
  { from: 'Patna Junction', to: 'Howrah', fromCode: 'PNBE', toCode: 'HWH', status: 'minor', delayMinutes: 10, distance: 347 },
  { from: 'New Delhi', to: 'Ajmer Junction', fromCode: 'NDLS', toCode: 'AII', status: 'on-time', delayMinutes: 3, distance: 390 },
  { from: 'Ajmer Junction', to: 'Vadodara Junction', fromCode: 'AII', toCode: 'BRC', status: 'minor', delayMinutes: 15, distance: 610 },
  { from: 'Vadodara Junction', to: 'Mumbai Central', fromCode: 'BRC', toCode: 'MMCT', status: 'on-time', delayMinutes: 4, distance: 384 },
  { from: 'New Delhi', to: 'Bhopal Junction', fromCode: 'NDLS', toCode: 'BPL', status: 'on-time', delayMinutes: 5, distance: 707 },
  { from: 'Bhopal Junction', to: 'Nagpur Junction', fromCode: 'BPL', toCode: 'NGP', status: 'minor', delayMinutes: 9, distance: 386 },
  { from: 'Nagpur Junction', to: 'Secunderabad', fromCode: 'NGP', toCode: 'SC', status: 'minor', delayMinutes: 16, distance: 571 },
  { from: 'Secunderabad', to: 'Vijayawada Junction', fromCode: 'SC', toCode: 'BZA', status: 'on-time', delayMinutes: 2, distance: 351 },
  { from: 'Vijayawada Junction', to: 'Chennai Central', fromCode: 'BZA', toCode: 'MAS', status: 'major', delayMinutes: 31, distance: 430 },
  { from: 'Chennai Central', to: 'Bengaluru City', fromCode: 'MAS', toCode: 'SBC', status: 'on-time', delayMinutes: 6, distance: 365 },
  { from: 'Mumbai Central', to: 'Pune Junction', fromCode: 'MMCT', toCode: 'PUNE', status: 'minor', delayMinutes: 11, distance: 164 },
  { from: 'Pune Junction', to: 'Secunderabad', fromCode: 'PUNE', toCode: 'SC', status: 'on-time', delayMinutes: 0, distance: 616 },
  { from: 'Howrah', to: 'Vijayawada Junction', fromCode: 'HWH', toCode: 'BZA', status: 'minor', delayMinutes: 14, distance: 1040 },
];

type CityStop = [name: string, code: string, km: number];
const cities: Record<string, CityStop> = {
  delhi: ['New Delhi', 'NDLS', 0], ghaziabad: ['Ghaziabad', 'GZB', 25], kanpur: ['Kanpur Central', 'CNB', 440], prayagraj: ['Prayagraj Junction', 'PRYJ', 635], patna: ['Patna Junction', 'PNBE', 1098], howrah: ['Howrah', 'HWH', 1445],
  ajmer: ['Ajmer Junction', 'AII', 390], vadodara: ['Vadodara Junction', 'BRC', 1000], mumbai: ['Mumbai Central', 'MMCT', 1384], pune: ['Pune Junction', 'PUNE', 1548],
  bhopal: ['Bhopal Junction', 'BPL', 707], nagpur: ['Nagpur Junction', 'NGP', 1093], secunderabad: ['Secunderabad', 'SC', 1664], vijayawada: ['Vijayawada Junction', 'BZA', 2015], chennai: ['Chennai Central', 'MAS', 2180], bengaluru: ['Bengaluru City', 'SBC', 2365],
};

function stationStatus(index: number, currentIndex: number): StationStatus { return index < currentIndex ? 'departed' : index === currentIndex ? 'arriving' : 'upcoming'; }
function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number); const total = ((hours * 60 + mins + minutes) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
function createTrain(id: string, number: string, name: string, type: Train['type'], route: CityStop[], departure: string, delay: number, confidence: number): Train {
  const currentStationIndex = Math.min(Number(id) % (route.length - 1), route.length - 2);
  const distance = route.slice(1).reduce((total, stop, index) => total + Math.abs(stop[2] - route[index][2]), 0);
  return {
    id, number, name, type, from: route[0][0], fromCode: route[0][1], to: route.at(-1)![0], toCode: route.at(-1)![1], distance,
    runningStatus: 'En Route', delay, routeProgress: 0.18 + (Number(id) % 10) * 0.055, scheduledDeparture: departure, predictedDeparture: addMinutes(departure, delay), platform: ((Number(id) - 1) % 16) + 1,
    boardStatus: delay === 0 ? 'ON TIME' : 'DELAYED', currentStationIndex, predictionConfidence: confidence,
    delayDrivers: delay === 0 ? [{ name: 'Clear Track', impact: 0, color: '#4caf50' }] : [{ name: delay > 30 ? 'Route Congestion' : 'Signal Regulation', impact: Math.max(4, Math.round(delay * 0.45)), color: delay > 30 ? '#f44336' : '#ff9800' }, { name: 'Weather Impact', impact: Math.round(delay * 0.2), color: '#ffc107' }],
    weather: { temperature: 24 + (Number(id) % 10), condition: delay > 25 ? 'Rain Showers' : delay > 0 ? 'Partly Cloudy' : 'Clear', wind: 6 + (Number(id) % 8), humidity: 55 + (Number(id) % 9) * 3, visibility: delay > 25 ? 6 : 12, etaImpact: Math.min(12, Math.round(delay / 4)) },
    stations: route.map(([stationName, code, km], index) => { const stationDelay = index === 0 ? delay : delay + index * 4; return { name: stationName, code, scheduledArrival: addMinutes(departure, index * 205), predictedArrival: addMinutes(departure, index * 205 + stationDelay), delay: stationDelay, platform: ((Number(id) + index) % 16) + 1, status: stationStatus(index, currentStationIndex), kmFromOrigin: km }; }),
  };
}

export const baseTrains: Train[] = [
  createTrain('1', '12345', 'Poorva Express', 'Express', [cities.delhi, cities.ghaziabad, cities.kanpur, cities.prayagraj, cities.patna, cities.howrah], '08:15', 32, 82),
  createTrain('2', '12951', 'Mumbai Rajdhani', 'Rajdhani', [cities.delhi, cities.ajmer, cities.vadodara, cities.mumbai], '16:55', 0, 94),
  createTrain('3', '12260', 'Sealdah Duronto', 'Duronto', [cities.delhi, cities.kanpur, cities.prayagraj, cities.patna, cities.howrah], '11:00', 24, 78),
  createTrain('4', '12616', 'Grand Trunk Express', 'Superfast', [cities.delhi, cities.bhopal, cities.nagpur, cities.secunderabad, cities.vijayawada, cities.chennai], '18:40', 7, 89),
  createTrain('5', '12164', 'Chennai Mail', 'Express', [cities.mumbai, cities.pune, cities.secunderabad, cities.vijayawada, cities.chennai], '23:45', 18, 84),
  createTrain('6', '12840', 'Coromandel Express', 'Superfast', [cities.chennai, cities.vijayawada, cities.howrah], '15:10', 11, 87),
  createTrain('7', '12627', 'Karnataka Express', 'Superfast', [cities.delhi, cities.bhopal, cities.nagpur, cities.secunderabad, cities.vijayawada, cities.chennai, cities.bengaluru], '20:20', 0, 92),
  createTrain('8', '12002', 'Bhopal Shatabdi', 'Shatabdi', [cities.delhi, cities.bhopal], '06:00', 5, 91),
  createTrain('9', '12321', 'Howrah Mail', 'Express', [cities.delhi, cities.kanpur, cities.prayagraj, cities.patna, cities.howrah], '22:30', 28, 77),
  createTrain('10', '12760', 'Charminar Express', 'Express', [cities.chennai, cities.vijayawada, cities.secunderabad], '18:15', 9, 86),
  createTrain('11', '12620', 'Matsyagandha Express', 'Superfast', [cities.mumbai, cities.pune, cities.secunderabad, cities.vijayawada, cities.chennai], '12:30', 0, 93),
  createTrain('12', '12101', 'Jnaneswari Super Deluxe', 'Superfast', [cities.mumbai, cities.pune, cities.secunderabad, cities.vijayawada, cities.howrah], '20:35', 22, 80),
  createTrain('13', '12424', 'Dibrugarh Rajdhani', 'Rajdhani', [cities.delhi, cities.kanpur, cities.prayagraj, cities.patna, cities.howrah], '16:10', 13, 88),
  createTrain('14', '12295', 'Sanghamitra Express', 'Superfast', [cities.bengaluru, cities.chennai, cities.vijayawada, cities.secunderabad, cities.nagpur, cities.bhopal, cities.delhi], '13:00', 35, 74),
  createTrain('15', '12904', 'Golden Temple Mail', 'Express', [cities.mumbai, cities.vadodara, cities.ajmer, cities.delhi], '21:25', 4, 90),
  createTrain('16', '12220', 'Lokmanya Tilak AC Express', 'Express', [cities.secunderabad, cities.pune, cities.mumbai], '08:05', 0, 95),
  createTrain('17', '12801', 'Purushottam Express', 'Superfast', [cities.delhi, cities.kanpur, cities.prayagraj, cities.patna, cities.howrah], '22:40', 16, 85),
  createTrain('18', '12019', 'Shatabdi Express', 'Shatabdi', [cities.delhi, cities.ajmer, cities.vadodara, cities.mumbai], '17:50', 6, 89),
  createTrain('19', '12138', 'Punjab Mail', 'Express', [cities.delhi, cities.bhopal, cities.nagpur, cities.pune, cities.mumbai], '05:15', 20, 81),
  createTrain('20', '12214', 'Yeshwantpur Duronto', 'Duronto', [cities.delhi, cities.bhopal, cities.nagpur, cities.secunderabad, cities.vijayawada, cities.chennai, cities.bengaluru], '21:40', 29, 76),
  createTrain('21', '12802', 'Purushottam Express Return', 'Superfast', [cities.howrah, cities.patna, cities.prayagraj, cities.kanpur, cities.delhi], '22:50', 8, 87),
  createTrain('22', '12610', 'Chennai Mail Return', 'Express', [cities.chennai, cities.vijayawada, cities.secunderabad, cities.pune, cities.mumbai], '23:55', 17, 83),
  createTrain('23', '12163', 'Mumbai–Chennai SF Express', 'Superfast', [cities.mumbai, cities.pune, cities.secunderabad, cities.vijayawada, cities.chennai], '23:45', 0, 94),
  createTrain('24', '12310', 'Rajendra Nagar Rajdhani', 'Rajdhani', [cities.delhi, cities.kanpur, cities.prayagraj, cities.patna], '19:10', 12, 88),
];

export const systemMessages = [
  '16-city network update: Prayagraj–Patna corridor has congestion near the eastern approach.',
  'Mumbai–Pune services have minor signal regulation.',
  'Delhi–Bhopal–Chennai corridor is broadly on schedule.',
  'Howrah terminal advisory: allow extra time for platform access.',
];
export function findTrainByNumber(number: string, trainList = baseTrains): Train | undefined { return trainList.find((train) => train.number === number); }
export function getDelayStatus(delay: number): 'on-time' | 'minor' | 'major' { return delay <= 0 ? 'on-time' : delay <= 30 ? 'minor' : 'major'; }
export function formatDelay(delay: number): string { return delay <= 0 ? 'On Time' : `+${delay} min`; }
export function getStatusColor(status: string, delay = 0): string { switch (status) { case 'DEPARTED': case 'ON TIME': return 'text-accent-green'; case 'DELAYED': return delay > 30 ? 'text-accent-red' : 'text-accent-orange'; case 'BOARDING': return 'text-accent-blue'; default: return 'text-text-secondary'; } }
export function getDisplayBoardStatus(boardStatus: Train['boardStatus'], delay: number): Train['boardStatus'] { return boardStatus === 'BOARDING' || boardStatus === 'DEPARTED' ? boardStatus : delay > 0 ? 'DELAYED' : 'ON TIME'; }
export function getTrainPosition(train: Train, stations: CorridorStation[]): { x: number; y: number } { const current = train.stations.find((station) => station.status === 'arriving' || station.status === 'current'); const city = stations.find((station) => station.code === current?.code) ?? stations.find((station) => station.code === train.fromCode) ?? stations[0]; return { x: city?.x ?? 40, y: city?.y ?? 80 }; }
