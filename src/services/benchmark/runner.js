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
    this.iterations = options.iterations || config.benchmark.defaultIterations;
    this.delayMs = options.delayMs || config.benchmark.requestDelayMs;
    this.onProgress = options.onProgress || (() => {});
    this.onResult = options.onResult || (() => {});
    this.aborted = false;
  }

  abort() {
    this.aborted = true;
  }

  async runTest(client, testType, providerName) {
    const results = [];
    const testFn = this.getTestFunction(client, testType);

    if (!testFn) {
      return { error: `Unknown test type: ${testType}`, results: [] };
    }

    for (let i = 0; i < this.iterations; i++) {
      if (this.aborted) break;

      const result = await this.executeTest(testFn, i);
      results.push(result);

      this.onProgress({
        provider: providerName,
        testType,
        iteration: i + 1,
        total: this.iterations,
        lastResult: result,
      });

      if (i < this.iterations - 1) {
        await delay(this.delayMs);
      }
    }

    const latencies = results.filter(r => r.success).map(r => r.latency);
    const stats = calculateStats(latencies);
    const successRate = calculateSuccessRate(results);

    const summary = {
      provider: providerName,
      testType,
      stats,
      successRate,
      totalRequests: results.length,
      timestamp: Date.now(),
    };

    this.onResult(summary);
    return summary;
  }

  async executeTest(testFn, iteration) {
    try {
      const { latency, status } = await testFn();
      return { success: true, latency, status, iteration };
    } catch (err) {
      return {
        success: false,
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

    for (const { name, client } of providers) {
      if (this.aborted) break;
      if (!client.isConfigured()) {
        allResults[name] = { error: 'API key not configured' };
        continue;
      }

      allResults[name] = {};
      for (const testType of Object.values(TestType)) {
        if (this.aborted) break;
        const testFn = this.getTestFunction(client, testType);
        if (testFn) {
          allResults[name][testType] = await this.runTest(client, testType, name);
        }
      }
    }

    return allResults;
  }
}

export function createBenchmarkRunner(options) {
  return new BenchmarkRunner(options);
}
