import { config } from '../../config.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

class AlchemyClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = `${config.alchemy.baseUrl}/${apiKey}`;
    this.timeout = config.benchmark.timeoutMs;
  }

  async rpcCall(method, params = []) {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latency = performance.now() - startTime;
      const data = await response.json();

      if (data.error) {
        const err = new Error(data.error.message || 'RPC Error');
        err.code = data.error.code;
        err.latency = latency;
        throw err;
      }

      return { data: data.result, latency, status: response.status };
    } catch (err) {
      clearTimeout(timeoutId);
      if (!err.latency) err.latency = performance.now() - startTime;
      throw err;
    }
  }

  async fetchWithLatency(url) {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const latency = performance.now() - startTime;

      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`);
        err.status = response.status;
        err.latency = latency;
        throw err;
      }

      const data = await response.json();
      return { data, latency, status: response.status };
    } catch (err) {
      clearTimeout(timeoutId);
      if (!err.latency) err.latency = performance.now() - startTime;
      throw err;
    }
  }

  async getTokenBalances(address = TEST_WALLET) {
    return this.rpcCall('alchemy_getTokenBalances', [address, 'erc20']);
  }

  async getTransactions(address = TEST_WALLET) {
    return this.rpcCall('alchemy_getAssetTransfers', [{
      fromAddress: address,
      category: ['external', 'erc20'],
      maxCount: '0x14',
    }]);
  }

  async getNFTs(address = TEST_WALLET) {
    const url = `https://eth-mainnet.g.alchemy.com/nft/v3/${this.apiKey}/getNFTsForOwner?owner=${address}&pageSize=10`;
    return this.fetchWithLatency(url);
  }

  async getTokenPrices(symbols = ['ETH']) {
    const url = `https://api.g.alchemy.com/prices/v1/${this.apiKey}/tokens/by-symbol?symbols=${symbols.join(',')}`;
    return this.fetchWithLatency(url);
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }
}

let instance = null;

export function getAlchemyClient() {
  if (!instance) {
    instance = new AlchemyClient(config.alchemy.apiKey);
  }
  return instance;
}

export function resetAlchemyClient() {
  instance = null;
}

export { AlchemyClient };
