export const config = {
  covalent: {
    apiKey: import.meta.env.VITE_COVALENT_API_KEY || '',
    rateLimit: { requests: 25, windowMs: 1000 },
  },
  codex: {
    apiKey: import.meta.env.VITE_CODEX_API_KEY || '',
    baseUrl: 'https://api.codex.io/graphql',
    rateLimit: { requests: 25, windowMs: 1000 },
  },
  alchemy: {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || '',
    baseUrl: 'https://eth-mainnet.g.alchemy.com/v2',
    rateLimit: { requests: 25, windowMs: 1000 },
  },
  mobula: {
    apiKey: import.meta.env.VITE_MOBULA_API_KEY || '',
    baseUrl: 'https://api.mobula.io/api/1',
    rateLimit: { requests: 25, windowMs: 1000 },
  },
  benchmark: {
    defaultIterations: 10,
    maxIterations: 100,
    requestDelayMs: 200,
    timeoutMs: 30000,
    retries: 2,
  },
};
