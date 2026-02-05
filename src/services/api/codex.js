import { Codex } from '@codex-data/sdk';
import { config } from '../../config.js';
import { RateLimiter, measureRequest } from './base.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

class CodexClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.timeout = config.benchmark.timeoutMs;
    const { requests, windowMs } = config.codex.rateLimit;
    this.rateLimiter = new RateLimiter(requests, windowMs);

    // Initialize SDK
    this.sdk = new Codex(apiKey);
  }

  async getTokenBalances(chainId = 'eth-mainnet', address = TEST_WALLET) {
    const networkId = chainId === 'eth-mainnet' ? 1 : 8453;
    await this.rateLimiter.acquire();

    return measureRequest(async (signal) => {
      const result = await this.sdk.queries.balances({
        input: { walletAddress: address, networks: [networkId], limit: 100 }
      });

      // Create a Response-like object
      const jsonData = { data: result };
      const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      return new Response(blob, {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    }, {
      timeoutMs: this.timeout,
      retries: config.benchmark.retries,
    });
  }

  async getTransactions(chainId = 'eth-mainnet', address = TEST_WALLET) {
    const networkId = chainId === 'eth-mainnet' ? 1 : 8453;
    await this.rateLimiter.acquire();

    return measureRequest(async (signal) => {
      const result = await this.sdk.queries.getTokenEventsForMaker({
        limit: 10,
        query: { maker: address, networkId: networkId }
      });

      const jsonData = { data: result };
      const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      return new Response(blob, {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    }, {
      timeoutMs: this.timeout,
      retries: config.benchmark.retries,
    });
  }

  async getNFTs(chainId = 'eth-mainnet', address = TEST_WALLET) {
    await this.rateLimiter.acquire();

    return measureRequest(async (signal) => {
      const result = await this.sdk.queries.walletNftCollections({
        input: { walletAddress: address }
      });

      const jsonData = { data: result };
      const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      return new Response(blob, {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    }, {
      timeoutMs: this.timeout,
      retries: config.benchmark.retries,
    });
  }

  async getTokenPrices(chainId = 'eth-mainnet', contractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
    const networkId = chainId === 'eth-mainnet' ? 1 : 8453;
    await this.rateLimiter.acquire();

    return measureRequest(async (signal) => {
      const result = await this.sdk.queries.token({
        input: { address: contractAddress, networkId }
      });

      const jsonData = { data: result };
      const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      return new Response(blob, {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    }, {
      timeoutMs: this.timeout,
      retries: config.benchmark.retries,
    });
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }
}

let instance = null;

export function getCodexClient() {
  if (!instance) {
    instance = new CodexClient(config.codex.apiKey);
  }
  return instance;
}

export function resetCodexClient() {
  instance = null;
}

export { CodexClient };
