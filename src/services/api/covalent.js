import { config } from '../../config.js';
import { RateLimiter, measureRequest } from './base.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const BASE_URL = 'https://api.covalenthq.com/v1';

class CovalentClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.timeout = config.benchmark.timeoutMs;
    const { requests, windowMs } = config.covalent.rateLimit;
    this.rateLimiter = new RateLimiter(requests, windowMs);
  }

  async request(endpoint) {
    await this.rateLimiter.acquire();

    return measureRequest((signal) =>
      fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal,
      }),
      {
        timeoutMs: this.timeout,
        retries: config.benchmark.retries,
      }
    ).then(res => {
      return {
        data: res.data,
        latency: res.latency,
        ttfb: res.ttfb,
        payloadSize: res.payloadSize,
        status: res.status,
      };
    });
  }

  async getTokenBalances(chainId = 'eth-mainnet', address = TEST_WALLET) {
    // Optimization: Disable NFT fetching for faster balance-only lookups
    return this.request(`/${chainId}/address/${address}/balances_v2/?nft=false&no-nft-fetch=true&page-size=20`);
  }

  async getTransactions(chainId = 'eth-mainnet', address = TEST_WALLET) {
    return this.request(`/${chainId}/address/${address}/transactions_v2/?page-size=10`);
  }

  async getNFTs(chainId = 'eth-mainnet', address = TEST_WALLET) {
    return this.request(`/${chainId}/address/${address}/balances_nft/?page-size=10`);
  }

  async getTokenPrices(chainId = 'eth-mainnet', contractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
    return this.request(`/pricing/historical_by_addresses_v2/${chainId}/USD/${contractAddress}/`);
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }
}

let instance = null;

export function getCovalentClient() {
  if (!instance) {
    instance = new CovalentClient(config.covalent.apiKey);
  }
  return instance;
}

export function resetCovalentClient() {
  instance = null;
}

export { CovalentClient };
