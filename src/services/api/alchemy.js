import { config } from '../../config.js';
import { RateLimiter, measureRequest } from './base.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

class AlchemyClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.timeout = config.benchmark.timeoutMs;
    const { requests, windowMs } = config.alchemy.rateLimit;
    this.rateLimiter = new RateLimiter(requests, windowMs);
  }

  getBaseUrl(chainId) {
    const network = chainId === 'eth-mainnet' ? 'eth-mainnet' : 'base-mainnet';
    return `https://${network}.g.alchemy.com/v2/${this.apiKey}`;
  }

  async rpcCall(method, params = [], chainId = 'eth-mainnet') {
    await this.rateLimiter.acquire();

    return measureRequest((signal) =>
      fetch(this.getBaseUrl(chainId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
        signal,
      }),
      {
        timeoutMs: this.timeout,
        retries: config.benchmark.retries,
      }
    ).then(res => {
      if (res.data.error) {
        const err = new Error(res.data.error.message || 'RPC Error');
        err.code = res.data.error.code;
        err.latency = res.latency;
        throw err;
      }
      return {
        data: res.data.result,
        latency: res.latency,
        ttfb: res.ttfb,
        payloadSize: res.payloadSize,
        status: res.status
      };
    });
  }

  async fetchWithLatency(url) {
    await this.rateLimiter.acquire();
    return measureRequest((signal) => fetch(url, { signal }), { timeoutMs: this.timeout });
  }

  async getTokenBalances(address = TEST_WALLET) {
    return this.rpcCall('alchemy_getTokenBalances', [address, 'erc20']);
  }

  async getTransactions(address = TEST_WALLET) {
    return this.rpcCall('alchemy_getAssetTransfers', [{
      fromAddress: address,
      category: ['external', 'erc20'],
      maxCount: '0x0A', // 10 transactions to match other providers
    }]);
  }

  async getNFTs(chainId = 'eth-mainnet', address = TEST_WALLET) {
    const network = chainId === 'eth-mainnet' ? 'eth-mainnet' : 'base-mainnet';
    const url = `https://${network}.g.alchemy.com/nft/v3/${this.apiKey}/getNFTsForOwner?owner=${address}&pageSize=10`;
    return this.fetchWithLatency(url);
  }

  async getTokenPrices(chainId = 'eth-mainnet', symbols = ['ETH']) {
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
