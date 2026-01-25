import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BenchmarkRunner, TestType, createBenchmarkRunner } from './runner.js';

describe('BenchmarkRunner', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      isConfigured: () => true,
      getTokenBalances: vi.fn().mockResolvedValue({ latency: 50, status: 200 }),
      getTransactions: vi.fn().mockResolvedValue({ latency: 75, status: 200 }),
      getNFTs: vi.fn().mockResolvedValue({ latency: 100, status: 200 }),
      getTokenPrices: vi.fn().mockResolvedValue({ latency: 30, status: 200 }),
    };
  });

  it('creates runner with default options', () => {
    const runner = createBenchmarkRunner();
    expect(runner).toBeInstanceOf(BenchmarkRunner);
  });

  it('creates runner with custom iterations', () => {
    const runner = createBenchmarkRunner({ iterations: 50 });
    expect(runner.iterations).toBe(50);
  });

  it('runs test and returns summary', async () => {
    const runner = createBenchmarkRunner({ iterations: 3, delayMs: 0 });
    const result = await runner.runTest(mockClient, TestType.BALANCE_LOOKUP, 'test');

    expect(result.provider).toBe('test');
    expect(result.testType).toBe(TestType.BALANCE_LOOKUP);
    expect(result.totalRequests).toBe(3);
    expect(result.successRate).toBe(100);
    expect(result.stats).toBeDefined();
    expect(result.stats.count).toBe(3);
  });

  it('calls onProgress during test execution', async () => {
    const onProgress = vi.fn();
    const runner = createBenchmarkRunner({ iterations: 3, delayMs: 0, onProgress });

    await runner.runTest(mockClient, TestType.BALANCE_LOOKUP, 'test');

    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'test',
        testType: TestType.BALANCE_LOOKUP,
        iteration: 1,
        total: 3,
      })
    );
  });

  it('calls onResult after test completion', async () => {
    const onResult = vi.fn();
    const runner = createBenchmarkRunner({ iterations: 2, delayMs: 0, onResult });

    await runner.runTest(mockClient, TestType.BALANCE_LOOKUP, 'test');

    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'test',
        testType: TestType.BALANCE_LOOKUP,
      })
    );
  });

  it('handles test failures gracefully', async () => {
    mockClient.getTokenBalances = vi.fn()
      .mockResolvedValueOnce({ latency: 50, status: 200 })
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ latency: 60, status: 200 });

    const runner = createBenchmarkRunner({ iterations: 3, delayMs: 0 });
    const result = await runner.runTest(mockClient, TestType.BALANCE_LOOKUP, 'test');

    expect(result.totalRequests).toBe(3);
    expect(result.successRate).toBeCloseTo(66.67, 0);
  });

  it('can be aborted', async () => {
    const runner = createBenchmarkRunner({ iterations: 100, delayMs: 10 });
    
    const promise = runner.runTest(mockClient, TestType.BALANCE_LOOKUP, 'test');
    
    setTimeout(() => runner.abort(), 25);
    
    const result = await promise;
    expect(result.totalRequests).toBeLessThan(100);
  });

  it('returns null for unsupported test type', () => {
    const runner = createBenchmarkRunner();
    const testFn = runner.getTestFunction(mockClient, 'unsupported');
    expect(testFn).toBeNull();
  });

  it('maps test types to correct client methods', () => {
    const runner = createBenchmarkRunner();

    expect(runner.getTestFunction(mockClient, TestType.BALANCE_LOOKUP)).toBeDefined();
    expect(runner.getTestFunction(mockClient, TestType.TRANSACTIONS)).toBeDefined();
    expect(runner.getTestFunction(mockClient, TestType.NFT_METADATA)).toBeDefined();
    expect(runner.getTestFunction(mockClient, TestType.TOKEN_PRICES)).toBeDefined();
  });
});

describe('TestType', () => {
  it('has expected test types', () => {
    expect(TestType.BALANCE_LOOKUP).toBe('balanceLookup');
    expect(TestType.TRANSACTIONS).toBe('transactions');
    expect(TestType.NFT_METADATA).toBe('nftMetadata');
    expect(TestType.TOKEN_PRICES).toBe('tokenPrices');
  });
});
