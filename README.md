# API Benchmark Dashboard

A benchmarking tool for comparing blockchain data API providers: Covalent, Alchemy, and Mobula.

## Features

- Live API benchmarking with configurable iterations
- Latency measurement (median, P95, P99)
- Success rate tracking
- Cached results with timestamps
- Side-by-side provider comparison

## Metrics Compared

| Metric | Description |
|--------|-------------|
| Balance Lookup | Token balance retrieval latency |
| Transactions | Historical transaction query time |
| NFT Metadata | NFT data fetch performance |
| Token Prices | Price data retrieval speed |

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment file and add API keys:

   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your API keys:

   ```
   VITE_COVALENT_API_KEY=your_key
   VITE_ALCHEMY_API_KEY=your_key
   VITE_MOBULA_API_KEY=your_key
   ```

## Development

```bash
npm run dev
```

## Testing

```bash
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/       # React components
  data/             # Static provider metadata
  hooks/            # React hooks (useBenchmark)
  services/
    api/            # API clients (Covalent, Alchemy, Mobula)
    benchmark/      # Benchmark runner and stats utilities
  config.js         # Configuration and environment variables
```

## API Clients

Each provider has a dedicated client with methods for:

- `getTokenBalances()` - Fetch wallet token balances
- `getTransactions()` - Query transaction history
- `getNFTs()` - Retrieve NFT holdings
- `getTokenPrices()` - Get token price data

## Benchmark Runner

The benchmark runner executes tests with:

- Configurable iteration count (5-100)
- Rate limiting between requests
- Progress callbacks for UI updates
- Statistical aggregation (min, max, median, P95, P99, stdDev)

## License

MIT
