// API Provider data for benchmark comparison
export const providers = [
  {
    id: 'covalent',
    name: 'GoldRush',
    initials: 'GR',
    tagline: 'The Gold Standard for Blockchain Data',
    description: 'Unified API for 200+ blockchains with comprehensive on-chain data.',
    website: 'https://www.covalenthq.com/',
    color: '#FF4D00',
    gradient: 'linear-gradient(135deg, #FF4D00 0%, #FF8A00 100%)',
    metrics: {
      chainsCount: 225,
      freeTierCredits: 100000,
      startingPrice: 0,
      rateLimit: 50,
      endpoints: 100,
      dataFreshness: 'Real-time',
      sdkLanguages: 'TS, Python, Go',
      slaUptime: '99.99%',
    },
    historicalDataDepth: 'Full History',
    historicalDataYears: 10,
    schemaNormalization: 'High',
    uniqueFeatures: {
      nameResolution: 'Name Resolution (ENS, Lens, etc.)',
    },
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    initials: 'AL',
    tagline: 'Web3 Development Platform',
    description: 'Industry-leading infrastructure for Ethereum and L2 chains.',
    website: 'https://alchemy.com',
    color: '#0052FF',
    gradient: 'linear-gradient(135deg, #0052FF 0%, #00A3FF 100%)',
    metrics: {
      chainsCount: 64,
      freeTierCredits: 30000000,
      startingPrice: 0,
      rateLimit: 25,
      endpoints: 80,
      dataFreshness: 'Real-time',
      sdkLanguages: 'JS, Python',
      slaUptime: '99.99%',
    },
    historicalDataDepth: 'Full History',
    historicalDataYears: 10,
    schemaNormalization: 'Medium',
    uniqueFeatures: {
      realtimeStreaming: 'Real-time WebSocket Streaming',
    },
  },
  {
    id: 'mobula',
    name: 'Mobula',
    initials: 'MB',
    tagline: 'Real-time Trading Infra',
    description: 'Low-latency trading and wallet infrastructure for 88+ chains with generous free usage.',
    website: 'https://mobula.io',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
    metrics: {
      chainsCount: 88,
      freeTierCredits: 10000,
      startingPrice: 0,
      rateLimit: null, // Unlimited RPS
      endpoints: 50,
      dataFreshness: 'Real-time',
      sdkLanguages: 'TS, Python, JS',
      slaUptime: '99.9%',
    },
    historicalDataDepth: 'Limited',
    historicalDataYears: 2,
    schemaNormalization: 'Medium',
    uniqueFeatures: {
      autoPagination: 'Auto-Pagination (Generators)',
    },
  },
  // Codex disabled for production due to plan limits
  /*
  {
    id: 'codex',
    name: 'Codex',
    initials: 'CX',
    tagline: 'Enriched Blockchain Data',
    description: 'Real-time, enriched blockchain data for tokens, NFTs, and wallet histories.',
    website: 'https://codex.io',
    color: '#00D1FF',
    gradient: 'linear-gradient(135deg, #00D1FF 0%, #0075FF 100%)',
    metrics: {
      chainsCount: 80,
      freeTierCredits: 50000,
      startingPrice: 0,
      rateLimit: 10,
      endpoints: 60,
      dataFreshness: 'Real-time',
      sdkLanguages: 'TS, Python',
      slaUptime: '99.95%',
    },
    historicalDataDepth: 'Full History',
    historicalDataYears: 5,
    schemaNormalization: 'High',
    uniqueFeatures: {
      multiChainFormat: 'Multi-Chain Input Formats',
      utilityFunctions: 'Built-in Utility Functions',
    },
  },
  */
];

// Export all providers
export const activeProviders = providers.filter(p => p.id !== 'codex');
