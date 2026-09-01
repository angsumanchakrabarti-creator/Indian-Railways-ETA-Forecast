import { describe, expect, it } from 'vitest';
import { baseTrains } from './mockData';
import { answerRailwayQuestion } from './railwayAssistant';

const selectedTrain = baseTrains[0];

describe('Railway Assistant', () => {
  it('answers a train location question', () => {
    expect(answerRailwayQuestion('Where is 12345?', selectedTrain).text).toContain('Poorva Express');
  });
  it('answers an ETA question for a selected train', () => {
    expect(answerRailwayQuestion('What is the ETA?', selectedTrain).text).toContain('estimated arrival');
  });
  it('lists network cities', () => {
    expect(answerRailwayQuestion('Which cities are covered?', selectedTrain).text).toContain('16 cities');
  });
  it('handles unknown train numbers safely', () => {
    expect(answerRailwayQuestion('Where is 99999?', selectedTrain).text).toContain('could not find');
  });
});
