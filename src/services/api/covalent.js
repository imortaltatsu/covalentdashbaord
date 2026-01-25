import { config } from '../../config.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

class CovalentClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = config.covalent.baseUrl;
    this.timeout = config.benchmark.timeoutMs;
  }

  async request(endpoint) {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${this.apiKey}:`)}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latency = performance.now() - startTime;

      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
        err.status = response.status;
        err.latency = latency;
        throw err;
      }

      const data = await response.json();
      return { data, latency, status: response.status };
    } catch (err) {
      clearTimeout(timeoutId);
      err.latency = performance.now() - startTime;
      throw err;
    }
  }

  async getTokenBalances(chainId = 1, address = TEST_WALLET) {
    return this.request(`/${chainId}/address/${address}/balances_v2/`);
  }

  async getTransactions(chainId = 1, address = TEST_WALLET) {
    return this.request(`/${chainId}/address/${address}/transactions_v3/`);
  }

  async getNFTs(chainId = 1, address = TEST_WALLET) {
    return this.request(`/${chainId}/address/${address}/balances_nft/`);
  }

  async getTokenPrices(chainId = 1, contractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
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
