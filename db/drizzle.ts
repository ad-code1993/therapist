// Mock database for development - replace with real connection later
export const db = {
  // Mock database methods
  query: () => Promise.resolve([]),
  execute: () => Promise.resolve({}),
  transaction: (fn: any) => fn(),
} as any;
