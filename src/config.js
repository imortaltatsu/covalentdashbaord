export const config = {
  covalent: {
    apiKey: import.meta.env.VITE_COVALENT_API_KEY || '',
    baseUrl: 'https://api.covalenthq.com/v1',
  },
  alchemy: {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || '',
    baseUrl: 'https://eth-mainnet.g.alchemy.com/v2',
  },
  mobula: {
    apiKey: import.meta.env.VITE_MOBULA_API_KEY || '',
    baseUrl: 'https://api.mobula.io/api/1',
  },
  benchmark: {
    defaultIterations: 10,
    maxIterations: 100,
    requestDelayMs: 200,
    timeoutMs: 30000,
  },
};
