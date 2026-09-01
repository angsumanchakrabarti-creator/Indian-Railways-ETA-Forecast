import { describe, expect, it } from 'vitest';
import { baseTrains, corridorSegments, corridorStations, findTrainByNumber, formatDelay, getDelayStatus } from '../data/mockData';

describe('16-city rail network', () => {
  it('contains sixteen uniquely coded cities', () => {
    expect(corridorStations).toHaveLength(16);
    expect(new Set(corridorStations.map((station) => station.code)).size).toBe(16);
  });
  it('connects every segment to known cities', () => {
    const codes = new Set(corridorStations.map((station) => station.code));
    expect(corridorSegments.length).toBeGreaterThanOrEqual(16);
    for (const segment of corridorSegments) {
      expect(codes.has(segment.fromCode)).toBe(true);
      expect(codes.has(segment.toCode)).toBe(true);
    }
  });
  it('provides twenty-four distinct train services using network cities', () => {
    const codes = new Set(corridorStations.map((station) => station.code));
    expect(baseTrains).toHaveLength(24);
    expect(new Set(baseTrains.map((train) => train.number)).size).toBe(24);
    for (const train of baseTrains) expect(train.stations.every((station) => codes.has(station.code))).toBe(true);
  });
  it('keeps the demo Poorva Express from Delhi to Howrah', () => {
    const train = findTrainByNumber('12345');
    expect(train?.fromCode).toBe('NDLS');
    expect(train?.toCode).toBe('HWH');
  });
  it('formats ETA delay helpers', () => {
    expect(getDelayStatus(0)).toBe('on-time');
    expect(getDelayStatus(18)).toBe('minor');
    expect(getDelayStatus(45)).toBe('major');
    expect(formatDelay(18)).toBe('+18 min');
  });
});
