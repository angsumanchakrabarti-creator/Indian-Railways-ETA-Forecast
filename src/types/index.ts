export type StationStatus = 'departed' | 'arriving' | 'upcoming' | 'current';

export interface Station {
  name: string;
  code: string;
  scheduledArrival: string;
  predictedArrival: string;
  delay: number;
  platform: number;
  status: StationStatus;
  kmFromOrigin?: number;
}

export interface DelayDriver {
  name: string;
  impact: number;
  color: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  wind: number;
  humidity: number;
  visibility: number;
  etaImpact: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'Express' | 'Superfast' | 'Passenger' | 'Rajdhani' | 'Shatabdi' | 'Duronto';
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  distance: number;
  runningStatus: 'En Route' | 'At Station' | 'Scheduled' | 'Terminated';
  delay: number;
  stations: Station[];
  delayDrivers: DelayDriver[];
  weather: WeatherInfo;
  predictionConfidence: number;
  currentStationIndex: number;
  scheduledDeparture: string;
  predictedDeparture: string;
  platform: number;
  boardStatus: 'DEPARTED' | 'ON TIME' | 'DELAYED' | 'BOARDING';
  routeProgress?: number;
  coaches?: CoachBlock[];
}

export type CoachBlockType = 'AC' | 'Sleeper' | 'General' | 'Chair' | 'Pantry' | 'Luggage';

export interface CoachBlock {
  id: string;
  type: CoachBlockType;
  status: 'occupied' | 'available' | 'maintenance';
  position: number;
}

export type CheckboardDay = 'yesterday' | 'today' | 'tomorrow';

export interface CheckboardStationRecord {
  code: string;
  name: string;
  scheduledArrival: string;
  actualArrival: string;
  delay: number;
  platform: number;
}

export interface CheckboardRecord {
  date: string;
  day: CheckboardDay;
  label: string;
  delay: number;
  runningStatus: Train['runningStatus'];
  boardStatus: Train['boardStatus'];
  stations: CheckboardStationRecord[];
  coaches: CoachBlock[];
  punctuality: number;
}

export interface CorridorSegment {
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  status: 'on-time' | 'minor' | 'major' | 'no-data';
  delayMinutes: number;
  distance: number;
}

export interface CorridorStation {
  name: string;
  code: string;
  x: number;
  y: number;
  km: number;
}

export interface TrackedTrain {
  trainNumber: string;
  pnr?: string;
  addedAt: string;
  nickname?: string;
}

export interface Booking {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  travelDate: string;
  class: string;
  seat: string;
  status: 'Confirmed' | 'Waitlisted' | 'Cancelled';
}

export interface User {
  name: string;
  email: string;
  phone: string;
  initials: string;
  ticketBooked: boolean;
  booking?: Booking;
}

export interface StoredUser extends User {
  password: string;
}
