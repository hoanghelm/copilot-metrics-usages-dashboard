import { generateMockMetrics, generateMockSeats } from './mockData';

const mockMetrics = generateMockMetrics(90);
const mockSeats = generateMockSeats();

export async function mockFetchMetrics(params: {
  startDate: Date;
  endDate: Date;
}) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const startStr = params.startDate.toISOString().split('T')[0];
  const endStr = params.endDate.toISOString().split('T')[0];

  return mockMetrics.filter(
    (m) => m.date >= startStr && m.date <= endStr
  );
}

export async function mockFetchSeats() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockSeats;
}
