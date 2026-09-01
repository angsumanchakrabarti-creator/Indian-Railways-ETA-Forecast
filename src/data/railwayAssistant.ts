import type { Train } from '../types';
import { baseTrains, corridorStations, findTrainByNumber, formatDelay } from './mockData';

export interface RailwayAssistantReply {
  text: string;
}

function currentStop(train: Train) {
  return train.stations[train.currentStationIndex] ?? train.stations[0];
}

export function answerRailwayQuestion(
  question: string,
  selectedTrain: Train,
  trains: Train[] = baseTrains,
): RailwayAssistantReply {
  const query = question.trim().toLowerCase();
  if (!query) return { text: 'Ask about a train number, ETA, route, delay, city, or booking.' };

  const trainNumber = query.match(/\b\d{5}\b/)?.[0];
  const requestedTrain = trainNumber ? findTrainByNumber(trainNumber, trains) : selectedTrain;
  if (trainNumber && !requestedTrain) {
    return { text: `I could not find train ${trainNumber} in this 24-service demo network.` };
  }

  if (query.includes('city') || query.includes('cities') || query.includes('network') || query.includes('station')) {
    return {
      text: `This network covers ${corridorStations.length} cities: ${corridorStations.map((city) => `${city.name} (${city.code})`).join(', ')}.`,
    };
  }

  if (query.includes('ticket') || query.includes('booking') || query.includes('pnr')) {
    return { text: 'This demo stores the demo booking locally. Use the Ticket Booked card for its PNR and the IRCTC link for real booking or PNR enquiries.' };
  }

  if (query.includes('train') && (query.includes('how many') || query.includes('count') || query.includes('all'))) {
    return { text: `There are ${trains.length} simulated services across ${corridorStations.length} cities. Use “Track Train” to search by number, name, or station code.` };
  }

  if (query.includes('route')) {
    return { text: `${requestedTrain!.number} ${requestedTrain!.name}: ${requestedTrain!.stations.map((station) => `${station.name} (${station.code})`).join(' → ')}.` };
  }

  if (query.includes('eta') || query.includes('arrival') || query.includes('delay') || query.includes('time')) {
    const destination = requestedTrain!.stations.at(-1)!;
    return { text: `${requestedTrain!.number} ${requestedTrain!.name} is ${requestedTrain!.delay > 0 ? formatDelay(requestedTrain!.delay) + ' late' : 'on time'}. Its estimated arrival at ${destination.name} is ${destination.predictedArrival}.` };
  }

  if (query.includes('where') || query.includes('location') || query.includes('current') || query.includes('status')) {
    const current = currentStop(requestedTrain!);
    const next = requestedTrain!.stations[requestedTrain!.currentStationIndex + 1];
    return { text: `${requestedTrain!.number} ${requestedTrain!.name} is currently at ${current.name} (${current.code})${next ? ` and next heads to ${next.name} (${next.code})` : ''}. Status: ${requestedTrain!.runningStatus}.` };
  }

  if (query.includes('help') || query.includes('what can')) {
    return { text: 'Try: “Where is 12345?”, “ETA for 12951”, “Route of 12627”, “Which cities are covered?”, or “How many trains are available?”' };
  }

  return { text: `I can help with the selected train ${selectedTrain.number} ${selectedTrain.name}. Ask for its location, ETA, delay, route, the network cities, or enter another five-digit train number.` };
}
