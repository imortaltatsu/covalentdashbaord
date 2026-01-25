import { ApiClient } from './base.js';
import { config } from '../../config.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

class MobulaClient extends ApiClient {
  constructor(apiKey) {
    super(config.mobula.baseUrl, {
      timeout: config.benchmark.timeoutMs,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
    });
    this.apiKey = apiKey;
  }

  async getWalletPortfolio(address = TEST_WALLET) {
    return this.get(`/wallet/portfolio?wallet=${address}`);
  }

  async getWalletTransactions(address = TEST_WALLET) {
    return this.get(`/wallet/transactions?wallet=${address}&limit=20`);
  }

  async getMarketData(asset = 'ethereum') {
    return this.get(`/market/data?asset=${asset}`);
  }

  async getTokenPrices(asset = 'ethereum') {
    return this.get(`/market/data?asset=${asset}`);
  }

  async getMultipleAssets(assets = ['bitcoin', 'ethereum']) {
    return this.get(`/market/multi-data?assets=${assets.join(',')}`);
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
