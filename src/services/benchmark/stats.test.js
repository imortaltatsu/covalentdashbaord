import { describe, it, expect } from 'vitest';
import { calculateStats, calculateSuccessRate, formatLatency } from './stats.js';

describe('calculateStats', () => {
  it('returns zeros for empty array', () => {
    const result = calculateStats([]);
    expect(result.min).toBe(0);
    expect(result.max).toBe(0);
    expect(result.mean).toBe(0);
    expect(result.median).toBe(0);
  });

  it('calculates correct stats for single value', () => {
    const result = calculateStats([100]);
    expect(result.min).toBe(100);
    expect(result.max).toBe(100);
    expect(result.mean).toBe(100);
    expect(result.median).toBe(100);
    expect(result.count).toBe(1);
  });

  it('calculates correct stats for multiple values', () => {
    const latencies = [10, 20, 30, 40, 50];
    const result = calculateStats(latencies);
    
    expect(result.min).toBe(10);
    expect(result.max).toBe(50);
    expect(result.mean).toBe(30);
    expect(result.median).toBe(30);
    expect(result.count).toBe(5);
  });

  it('calculates percentiles correctly', () => {
    const latencies = Array.from({ length: 100 }, (_, i) => i + 1);
    const result = calculateStats(latencies);
    
    expect(result.p95).toBe(95);
    expect(result.p99).toBe(99);
  });

  it('handles unsorted input', () => {
    const latencies = [50, 10, 30, 40, 20];
    const result = calculateStats(latencies);
    
    expect(result.min).toBe(10);
    expect(result.max).toBe(50);
    expect(result.median).toBe(30);
  });

  it('calculates standard deviation', () => {
    const latencies = [2, 4, 4, 4, 5, 5, 7, 9];
    const result = calculateStats(latencies);
    
    expect(result.stdDev).toBeCloseTo(2, 0);
  });
});

describe('calculateSuccessRate', () => {
  it('returns 0 for empty array', () => {
    expect(calculateSuccessRate([])).toBe(0);
  });

  it('returns 100 for all successes', () => {
    const results = [
      { success: true },
      { success: true },
      { success: true },
    ];
    expect(calculateSuccessRate(results)).toBe(100);
  });

  it('returns 0 for all failures', () => {
    const results = [
      { success: false },
      { success: false },
    ];
    expect(calculateSuccessRate(results)).toBe(0);
  });

  it('calculates correct percentage', () => {
    const results = [
      { success: true },
      { success: true },
      { success: false },
      { success: true },
    ];
    expect(calculateSuccessRate(results)).toBe(75);
  });
});

describe('formatLatency', () => {
  it('formats sub-millisecond values', () => {
    expect(formatLatency(0.5)).toBe('<1ms');
  });

  it('formats millisecond values', () => {
    expect(formatLatency(50)).toBe('50ms');
    expect(formatLatency(999)).toBe('999ms');
  });

  it('formats second values', () => {
    expect(formatLatency(1000)).toBe('1.00s');
    expect(formatLatency(2500)).toBe('2.50s');
  });

  it('rounds milliseconds', () => {
    expect(formatLatency(50.7)).toBe('51ms');
  });
});
