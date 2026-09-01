import { describe, it, expect } from 'vitest';
import { baseTrains } from '../data/mockData';
import { generateCoaches, getCheckboardRecord, getAllCheckboardRecords } from '../data/coachData';

describe('coachData', () => {
  const train = baseTrains[0];

  it('generates at least 12 coach blocks per train', () => {
    const coaches = generateCoaches(train);
    expect(coaches.length).toBeGreaterThanOrEqual(12);
  });

  it('names coaches with block ids like A1, S1', () => {
    const coaches = generateCoaches(train);
    expect(coaches.some((c) => /^[A-Z]+\d+$/.test(c.id) || ['PC', 'GEN', 'SLR'].includes(c.id))).toBe(true);
    expect(coaches.find((c) => c.id === 'A1')).toBeDefined();
  });

  it('provides yesterday, today, and tomorrow checkboard records', () => {
    const records = getAllCheckboardRecords(train, new Date('2026-09-01'));
    expect(records).toHaveLength(3);
    expect(records.map((r) => r.day)).toEqual(['yesterday', 'today', 'tomorrow']);
  });

  it('yesterday record is dated one day before reference', () => {
    const record = getCheckboardRecord(train, 'yesterday', new Date('2026-09-01'));
    expect(record.date).toBe('2026-08-31');
  });

  it('tomorrow record is dated one day after reference', () => {
    const record = getCheckboardRecord(train, 'tomorrow', new Date('2026-09-01'));
    expect(record.date).toBe('2026-09-02');
  });
});
