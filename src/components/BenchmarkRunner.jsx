import { useState } from 'react';
import { useBenchmark } from '../hooks/useBenchmark.js';
import { formatLatency } from '../services/benchmark/stats.js';
import { config } from '../config.js';

const TEST_LABELS = {
  balanceLookup: 'Balance Lookup',
  transactions: 'Transactions',
  nftMetadata: 'NFT Metadata',
  tokenPrices: 'Token Prices',
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
    config.covalent.apiKey || config.alchemy.apiKey || config.mobula.apiKey;

  return (
    <div className="benchmark-runner">
      <div className="benchmark-header">
        <div className="benchmark-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
          </svg>
        </div>
        <div>
          <h3 className="benchmark-title">Live Benchmark</h3>
          <p className="benchmark-subtitle">Run real API tests against all providers</p>
        </div>
      </div>

      {!apiKeysConfigured && (
        <div className="benchmark-warning">
          No API keys configured. Copy .env.example to .env and add your keys.
        </div>
      )}

      <div className="benchmark-controls">
        <div className="iteration-control">
          <label htmlFor="iterations">Iterations per test:</label>
          <select
            id="iterations"
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            disabled={isRunning}
          >
            <option value={5}>5 (quick)</option>
            <option value={10}>10 (default)</option>
            <option value={25}>25 (thorough)</option>
            <option value={50}>50 (comprehensive)</option>
            <option value={100}>100 (full)</option>
          </select>
        </div>

        <div className="benchmark-actions">
          {!isRunning ? (
            <button
              type="button"
              className="btn-run"
              onClick={handleRun}
              disabled={!apiKeysConfigured}
            >
              Run Benchmark
            </button>
          ) : (
            <button type="button" className="btn-stop" onClick={stopBenchmark}>
              Stop
            </button>
          )}
          {hasResults && !isRunning && (
            <button type="button" className="btn-clear" onClick={clearResults}>
              Clear
            </button>
          )}
        </div>
      </div>

      {isRunning && progress && (
        <div className="benchmark-progress">
          <div className="progress-info">
            <span className="progress-provider">{progress.provider}</span>
            <span className="progress-test">{TEST_LABELS[progress.testType] || progress.testType}</span>
            <span className="progress-count">
              {progress.iteration}/{progress.total}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{ width: `${(progress.iteration / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && <div className="benchmark-error">{error}</div>}

      {hasResults && !isRunning && (
        <BenchmarkResults results={results} />
      )}

      <style>{`
        .benchmark-runner {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
        }

        .benchmark-header {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .benchmark-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 107, 53, 0.1);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-covalent);
          flex-shrink: 0;
        }

        .benchmark-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .benchmark-subtitle {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .benchmark-warning {
          background: rgba(201, 145, 58, 0.1);
          border: 1px solid rgba(201, 145, 58, 0.3);
          border-radius: var(--radius-sm);
          padding: var(--spacing-sm);
          font-size: 0.75rem;
          color: var(--accent-warning);
          margin-bottom: var(--spacing-md);
        }

        .benchmark-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .iteration-control {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .iteration-control select {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          color: var(--text-primary);
          font-size: 0.8rem;
        }

        .benchmark-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .btn-run, .btn-stop, .btn-clear {
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
        }

        .btn-run {
          background: var(--color-covalent);
          color: white;
        }

        .btn-run:hover:not(:disabled) {
          opacity: 0.9;
        }

        .btn-run:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-stop {
          background: var(--accent-danger);
          color: white;
        }

        .btn-clear {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }

        .benchmark-progress {
          margin-bottom: var(--spacing-md);
        }

        .progress-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xs);
          font-size: 0.75rem;
        }

        .progress-provider {
          color: var(--color-covalent);
          font-weight: 600;
          text-transform: capitalize;
        }

        .progress-test {
          color: var(--text-secondary);
        }

        .progress-count {
          color: var(--text-muted);
          margin-left: auto;
        }

        .benchmark-error {
          background: rgba(196, 80, 80, 0.1);
          border: 1px solid rgba(196, 80, 80, 0.3);
          border-radius: var(--radius-sm);
          padding: var(--spacing-sm);
          font-size: 0.75rem;
          color: var(--accent-danger);
          margin-bottom: var(--spacing-md);
        }
      `}</style>
    </div>
  );
}

function BenchmarkResults({ results }) {
  if (!results?.data) return null;

  const providers = Object.entries(results.data);
  const timestamp = new Date(results.timestamp).toLocaleString();

  return (
    <div className="benchmark-results">
      <div className="results-meta">
        <span>Last run: {timestamp}</span>
        <span>{results.iterations} iterations per test</span>
      </div>

      <table className="results-table">
        <thead>
          <tr>
            <th>Test</th>
            {providers.map(([name]) => (
              <th key={name} className={`provider-${name}`}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(TEST_LABELS).map(([key, label]) => (
            <tr key={key}>
              <td>{label}</td>
              {providers.map(([name, data]) => {
                const testResult = data[key];
                if (!testResult || testResult.error) {
                  return <td key={name} className="na">N/A</td>;
                }
                const isBest = findBestProvider(providers, key) === name;
                return (
                  <td key={name} className={isBest ? 'best' : ''}>
                    <span className="latency">{formatLatency(testResult.stats.median)}</span>
                    <span className="success-rate">{testResult.successRate}%</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .benchmark-results {
          margin-top: var(--spacing-md);
        }

        .results-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-bottom: var(--spacing-sm);
        }

        .results-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .results-table th,
        .results-table td {
          padding: var(--spacing-sm);
          text-align: left;
          border-bottom: 1px solid var(--border-subtle);
        }

        .results-table th {
          font-weight: 500;
          color: var(--text-secondary);
          font-size: 0.7rem;
          text-transform: uppercase;
        }

        .results-table .provider-covalent { color: var(--color-covalent); }
        .results-table .provider-alchemy { color: var(--color-alchemy); }
        .results-table .provider-mobula { color: var(--color-mobula); }

        .results-table td.best {
          background: rgba(61, 153, 112, 0.08);
        }

        .results-table td.best .latency {
          color: var(--accent-success);
          font-weight: 600;
        }

        .results-table .latency {
          display: block;
        }

        .results-table .success-rate {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .results-table .na {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

function findBestProvider(providers, testKey) {
  let best = null;
  let bestMedian = Number.POSITIVE_INFINITY;

  for (const [name, data] of providers) {
    const testResult = data[testKey];
    if (testResult?.stats?.median && testResult.stats.median < bestMedian) {
      bestMedian = testResult.stats.median;
      best = name;
    }
  }

  return best;
}
