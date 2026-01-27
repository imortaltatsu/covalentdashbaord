import { config } from '../../config.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const BASE_URL = config.mobula.baseUrl;

class MobulaClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.timeout = config.benchmark.timeoutMs;
  }

  async request(endpoint) {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': this.apiKey,
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

  async getTokenBalances(address = TEST_WALLET) {
    return this.request(`/wallet/portfolio?wallet=${address}`);
  }

  async getTransactions(address = TEST_WALLET) {
    return this.request(`/wallet/transactions?wallet=${address}&limit=20`);
  }

  async getNFTs(address = TEST_WALLET) {
    return this.request(`/wallet/nfts?wallet=${address}`);
  }

  async getTokenPrices(asset = 'ethereum') {
    return this.request(`/market/data?asset=${asset}`);
  }

  isConfigured() {
    return Boolean(this.apiKey);
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
