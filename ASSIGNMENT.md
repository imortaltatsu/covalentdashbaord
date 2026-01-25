# Assignment

## What was asked

Build a dashboard that compares Covalent's GoldRush API against competitors (Alchemy, Mobula). The goal was to show where Covalent wins on metrics like chain coverage, latency, and unique features.

## What I built

A React dashboard with:

- Live API benchmarking that actually calls each provider's endpoints
- Side-by-side comparison table showing chains, pricing, rate limits, etc.
- Real-time progress updates as benchmarks run
- A section highlighting Covalent's unique capabilities (name resolution, streaming, auto-pagination)

The benchmark runner measures latency for balance lookups, transactions, NFTs, and token prices across all three providers.

## Tech stack

- React 19 + Vite
- Direct REST API calls to each provider
- Vitest for unit tests

## Notes

The comparison data (chain counts, pricing tiers) is static since that info doesn't change. The latency numbers come from live API calls during benchmarks.

Covalent's SDK caused Vite bundling issues, so I switched to direct REST calls using the same GoldRush API endpoints.
