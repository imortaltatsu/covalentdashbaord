import { useState } from 'react';
import { useBenchmark } from '../hooks/useBenchmark.js';
import { formatLatency, formatBytes, formatThroughput } from '../services/benchmark/stats.js';
import { config } from '../config.js';

const TEST_LABELS = {
  balanceLookup: 'Balance Lookup',
  transactions: 'Transactions',
  nftMetadata: 'NFT Metadata',
  tokenPrices: 'Token Prices',
};

// Map technical metric names to user-friendly labels
const METRIC_LABELS = {
  latency: 'Latency (Avg)',
  p95: 'Latency (p95)',
  throughput: 'Throughput',
  payload: 'Payload Size'
};

export default function BenchmarkRunner() {
  const [iterations, setIterations] = useState(10);
  const {
    status,
    progress,
    results,
    error,
    runBenchmark,
    stopBenchmark,
    clearResults,
    isRunning,
    hasResults,
  } = useBenchmark();

  const handleRun = () => {
    runBenchmark(iterations);
  };

  const apiKeysConfigured =
    config.covalent.apiKey || config.alchemy.apiKey || config.mobula.apiKey || config.codex.apiKey;

  return (
    <div className="benchmark-runner">
      {isRunning && progress && (
        <div className="progress-indicator">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, (progress.completedRequests / progress.totalRequests) * 100)}%` }}
          />
        </div>
      )}

      <div className="header-row">
        <div>
          <h2 className="title">API Benchmark</h2>
          <p className="subtitle">Real-time performance comparison</p>
        </div>

        <div className="controls">
          <div className="select-wrapper">
            <select
              id="iterations"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              disabled={isRunning}
            >
              <option value={5}>5 runs</option>
              <option value={10}>10 runs</option>
              <option value={20}>20 runs</option>
            </select>
          </div>

          {!isRunning ? (
            <button
              className="btn btn-primary"
              onClick={handleRun}
              disabled={!apiKeysConfigured}
            >
              Start Benchmark
            </button>
          ) : (
            <button className="btn btn-danger" onClick={stopBenchmark}>
              Stop
            </button>
          )}

          {hasResults && !isRunning && (
            <button className="btn btn-secondary" onClick={clearResults}>
              Clear
            </button>
          )}
        </div>
      </div>

      {!apiKeysConfigured && (
        <div className="warning-banner">
          ⚠️ No API keys configured. Please checking your .env file.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {hasResults && !isRunning && (
        <BenchmarkResults results={results} />
      )}

      <style>{`
        .benchmark-runner {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .select-wrapper select {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s;
        }

        /* ... */

        .warning-banner, .error-banner {
          padding: 12px;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-bottom: 24px;
        }

        /* ... */

        .table-wrapper {
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.01);
          overflow: hidden;
        }

        /* ... */

        .payload-note {
          margin-top: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          gap: 8px;
          align-items: flex-start;
          border: 1px solid var(--border-subtle);
        }

        .info-icon {
          color: var(--color-codex);
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>

      <div className="payload-note">
        <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          <strong>Note on Payload Size:</strong> Large differences (MB vs KB) are due to API architecture.
          Alchemy returns raw hex data in this benchmark. Obtaining enriched data (metadata, prices) would require additional calls or SDK usage, whereas GoldRush/Mobula return this by default.
        </span>
      </div>
    </div>
  );
}
