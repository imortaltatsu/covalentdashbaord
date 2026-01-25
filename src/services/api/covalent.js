import { CovalentClient as SDK } from '@covalenthq/client-sdk';
import { config } from '../../config.js';

const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

class CovalentClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.sdk = apiKey ? new SDK(apiKey) : null;
  }

  async withLatency(fn) {
    const startTime = performance.now();
    try {
      const result = await fn();
      const latency = performance.now() - startTime;
      return { data: result.data, latency, status: 200 };
    } catch (err) {
      err.latency = performance.now() - startTime;
      throw err;
    }
  }

  async getTokenBalances(chainId = 'eth-mainnet', address = TEST_WALLET) {
    return this.withLatency(() => 
      this.sdk.BalanceService.getTokenBalancesForWalletAddress(chainId, address)
    );
  }

  async getTransactions(chainId = 'eth-mainnet', address = TEST_WALLET) {
    return this.withLatency(() => 
      this.sdk.TransactionService.getAllTransactionsForAddress(chainId, address, { pageSize: 10 })
    );
  }

  async getNFTs(chainId = 'eth-mainnet', address = TEST_WALLET) {
    return this.withLatency(() => 
      this.sdk.NftService.getNftsForAddress(chainId, address, { pageSize: 10 })
    );
  }

  async getTokenPrices(chainId = 'eth-mainnet', contractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
    return this.withLatency(() => 
      this.sdk.PricingService.getTokenPrices(chainId, 'USD', contractAddress)
    );
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
