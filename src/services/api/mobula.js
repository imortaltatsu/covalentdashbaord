import { config } from '../../config.js';
import { RateLimiter, measureRequest } from './base.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const BASE_URL = config.mobula.baseUrl;

class MobulaClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.timeout = config.benchmark.timeoutMs;
    const { requests, windowMs } = config.mobula.rateLimit;
    this.rateLimiter = new RateLimiter(requests || 100, windowMs || 1000);
  }

  async request(endpoint) {
    await this.rateLimiter.acquire();

    return measureRequest((signal) =>
      fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': this.apiKey,
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
    const blockchain = chainId === 'eth-mainnet' ? 'ethereum' : 'base';
    return this.request(`/wallet/portfolio?wallet=${address}&blockchains=${blockchain}&limit=20`);
  }

  async getTransactions(chainId = 'eth-mainnet', address = TEST_WALLET) {
    const blockchain = chainId === 'eth-mainnet' ? 'ethereum' : 'base';
    // Using /wallet/transactions which is the standard endpoint in the reference
    return this.request(`/wallet/transactions?wallet=${address}&blockchains=${blockchain}&limit=10`);
  }

  async getNFTs(chainId = 'eth-mainnet', address = TEST_WALLET) {
    const blockchain = chainId === 'eth-mainnet' ? 'ethereum' : 'base';
    return this.request(`/wallet/nfts?wallet=${address}&blockchains=${blockchain}&limit=10`);
  }

  async getTokenPrices(chainId = 'eth-mainnet', asset = 'ethereum') {
    return this.request(`/market/data?asset=${asset}`);
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }
}

let instance = null;

export function getMobulaClient() {
  if (!instance) {
    instance = new MobulaClient(config.mobula.apiKey);
  }
  return instance;
}

export function resetMobulaClient() {
  instance = null;
}

export { MobulaClient };
