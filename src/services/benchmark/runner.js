import { config } from '../../config.js';
import { calculateStats, calculateSuccessRate } from './stats.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const TestType = {
  BALANCE_LOOKUP: 'balanceLookup',
  TRANSACTIONS: 'transactions',
  NFT_METADATA: 'nftMetadata',
  TOKEN_PRICES: 'tokenPrices',
};

export class BenchmarkRunner {
  constructor(options = {}) {
    const {
      iterations,
      delayMs,
      onProgress,
      onResult,
    } = options;

    // Clamp iterations and allow 0-delay runs for fast local benchmarks/tests
    if (Number.isInteger(iterations) && iterations > 0) {
      this.iterations = Math.min(iterations, config.benchmark.maxIterations);
    } else {
      this.iterations = config.benchmark.defaultIterations;
    }

    this.delayMs = typeof delayMs === 'number' && delayMs >= 0
      ? delayMs
      : config.benchmark.requestDelayMs;

    this.onProgress = onProgress || (() => { });
    this.onResult = onResult || (() => { });
    this.aborted = false;
  }

  abort() {
    this.aborted = true;
  }

  async runTest(client, testType, providerName) {
    const testFn = this.getTestFunction(client, testType);

    if (!testFn) {
      return { error: `Unknown test type: ${testType}`, results: [] };
    }

    const testStartTime = performance.now();
    const promises = Array.from({ length: this.iterations }).map(async (_, i) => {
      if (this.aborted) return null;

      const result = await this.executeTest(testFn, i);

      this.onProgress({
        provider: providerName,
        testType,
        iteration: i + 1,
        total: this.iterations,
        lastResult: result,
      });

      return result;
    });

    const results = (await Promise.all(promises)).filter(r => r !== null);
    const testEndTime = performance.now();
    const totalDurationMs = testEndTime - testStartTime;

    const successes = results.filter(r => r.success);

    // Latency KPIs
    // Latency KPIs - Include ALL results that have latency, even errors
    const latencies = results.filter(r => typeof r.latency === 'number').map(r => r.latency);
    const stats = calculateStats(latencies);

    // TTFB KPIs
    const ttfbs = successes.filter(r => r.ttfb !== undefined).map(r => r.ttfb);
    const ttfbStats = calculateStats(ttfbs);

    // Payload Size KPI
    const payloadSizes = successes.filter(r => r.payloadSize !== undefined).map(r => r.payloadSize);
    const avgPayloadSize = payloadSizes.length
      ? payloadSizes.reduce((a, b) => a + b, 0) / payloadSizes.length
      : 0;

    // Throughput (Requests per Second)
    const throughput = totalDurationMs > 0
      ? (successes.length / (totalDurationMs / 1000))
      : 0;

    const successRate = calculateSuccessRate(results);

    const summary = {
      provider: providerName,
      testType,
      stats,
      ttfbStats,
      avgPayloadSize,
      throughput,
      successRate,
      history: results, // Include full history for graphing
      totalRequests: results.length,
      durationMs: totalDurationMs,
      timestamp: Date.now(),
      error: successRate === 0 ? results[0]?.error : null,
    };

    this.onResult(summary);
    return summary;
  }

  async executeTest(testFn, iteration) {
    try {
      const result = await testFn();

      return {
        success: true,
        latency: result.latency,
        ttfb: result.ttfb,
        payloadSize: result.payloadSize,
        status: result.status,
        iteration,
        raw: result.data,
      };
    } catch (err) {
      return {
        success: false,
        latency: err.latency || 0,
        ttfb: err.ttfb || 0,
        error: err.message,
        code: err.code || err.status,
        iteration,
      };
    }
  }

  getTestFunction(client, testType) {
    const fnMap = {
      [TestType.BALANCE_LOOKUP]: () => {
        if (client.getTokenBalances) return client.getTokenBalances.bind(client);
        if (client.getWalletPortfolio) return client.getWalletPortfolio.bind(client);
        return null;
      },
      [TestType.TRANSACTIONS]: () => {
        if (client.getTransactions) return client.getTransactions.bind(client);
        if (client.getWalletTransactions) return client.getWalletTransactions.bind(client);
        return null;
      },
      [TestType.NFT_METADATA]: () => {
        if (client.getNFTs) return client.getNFTs.bind(client);
        return null;
      },
      [TestType.TOKEN_PRICES]: () => {
        if (client.getTokenPrices) return client.getTokenPrices.bind(client);
        if (client.getMarketData) return client.getMarketData.bind(client);
        return null;
      },
    };

    const getFn = fnMap[testType];
    return getFn ? getFn() : null;
  }

  async runAllTests(providers) {
    const allResults = {};

    // We run each provider in parallel for maximum speed
    const providerPromises = providers.map(async ({ name, client }) => {
      if (this.aborted) return;
      if (!client.isConfigured()) {
        allResults[name] = { error: 'API key not configured' };
        return;
      }

      allResults[name] = {};
      const testTypes = Object.values(TestType);

      // We also run the different test types for each provider in parallel
      const testPromises = testTypes.map(async (testType) => {
        if (this.aborted) return;
        const testFn = this.getTestFunction(client, testType);
        if (testFn) {
          allResults[name][testType] = await this.runTest(client, testType, name);
        }
      });

      await Promise.all(testPromises);
    });

    await Promise.all(providerPromises);
    return allResults;
  }
}

export function createBenchmarkRunner(options) {
  return new BenchmarkRunner(options);
}
