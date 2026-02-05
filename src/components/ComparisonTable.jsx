import { activeProviders as providers } from '../data/providers';

export default function ComparisonTable() {
    const getWinner = (key) => {
        if (key === 'chainsCount') return 'covalent';
        if (key === 'rateLimit') return 'mobula';
        if (key === 'historicalDataYears') return 'covalent';
        return null;
    };

    const hasFreeTier = (p) => p.metrics.startingPrice === 0;

    return (
        <div className="glass-card table-container">
            <div className="table-header">
                <div className="table-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3h18v18H3z" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                    </svg>
                </div>
                <div>
                    <h3 className="table-title">Provider Analysis</h3>
                    <p className="table-subtitle">Comprehensive side-by-side technical evaluation</p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            {providers.map(p => (
                                <th key={p.id}>
                                    <span className="provider-header-cell" style={{ color: p.color }}>
                                        <span className="provider-dot" style={{ background: p.color }} />
                                        {p.name}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    <span>Chains Covered</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td
                                    key={p.id}
                                    className={getWinner('chainsCount') === p.id ? 'winner-cell' : ''}
                                >
                                    <span className="value" style={{ color: getWinner('chainsCount') === p.id ? p.color : 'inherit' }}>
                                        {p.metrics.chainsCount}+
                                    </span>
                                    {getWinner('chainsCount') === p.id && <span className="winner-badge">Best</span>}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23" />
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                    <span>Starting Price</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td
                                    key={p.id}
                                    className={hasFreeTier(p) ? 'winner-cell' : ''}
                                >
                                    <span className="value" style={{ color: hasFreeTier(p) ? p.color : 'inherit' }}>
                                        {p.metrics.startingPrice === 0 ? 'Free' : `$${p.metrics.startingPrice}/mo`}
                                    </span>
                                    {hasFreeTier(p) && <span className="winner-badge">Free Tier</span>}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                                    </svg>
                                    <span>Rate Limit (RPS)</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td
                                    key={p.id}
                                    className={getWinner('rateLimit') === p.id ? 'winner-cell' : ''}
                                >
                                    <span className="value" style={{ color: getWinner('rateLimit') === p.id ? p.color : 'inherit' }}>
                                        {p.metrics.rateLimit === null ? 'Unlimited' : `${p.metrics.rateLimit} RPS`}
                                    </span>
                                    {getWinner('rateLimit') === p.id && <span className="winner-badge">Best</span>}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17,8 12,3 7,8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span>Free Tier</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="value">{formatCredits(p.metrics.freeTierCredits)}</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 11a9 9 0 0 1 9 9" />
                                        <path d="M4 4a16 16 0 0 1 16 16" />
                                        <circle cx="5" cy="19" r="1" />
                                    </svg>
                                    <span>API Endpoints</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="value">{p.metrics.endpoints}+</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
                                    </svg>
                                    <span>Data Freshness</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="badge-success">{p.metrics.dataFreshness}</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 18l2-2v-6l-2-2H8l-2 2v6l2 2h8z" />
                                        <path d="M12 2v4" />
                                        <path d="M12 18v4" />
                                    </svg>
                                    <span>SDK Languages</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="value">{p.metrics.sdkLanguages}</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>SLA Uptime</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="badge-success">{p.metrics.slaUptime}</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M3 3v18h18" />
                                        <path d="M18 9l-5 5-4-4-6 6" />
                                    </svg>
                                    <span>Historical Data</span>
                                </div>
                            </td>
                            {providers.map(p => {
                                const isBest = p.historicalDataYears === Math.max(...providers.map(pr => pr.historicalDataYears));
                                return (
                                    <td key={p.id} className={isBest ? 'winner-cell' : ''}>
                                        <span className="value" style={{ color: isBest ? p.color : 'inherit' }}>
                                            {p.historicalDataYears}+ years
                                        </span>
                                        {isBest && <span className="winner-badge">Best</span>}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <path d="M2 10h20" />
                                    </svg>
                                    <span>Schema Normalization</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className={p.schemaNormalization === 'High' ? 'badge-success' : 'badge-neutral'}>
                                        {p.schemaNormalization}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        <tr className="section-header">
                            <td colSpan={providers.length + 1}>
                                <strong>Unique Capabilities</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <span>Name Resolution (ENS, Lens, etc.)</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    {p.uniqueFeatures?.nameResolution ? (
                                        <span className="check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="20,6 9,17 4,12" /></svg></span>
                                    ) : (
                                        <span className="cross"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <span>Real-time WebSocket Streaming</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    {p.uniqueFeatures?.realtimeStreaming ? (
                                        <span className="check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="20,6 9,17 4,12" /></svg></span>
                                    ) : (
                                        <span className="cross"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <span>Auto-Pagination (Generators)</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    {p.uniqueFeatures?.autoPagination ? (
                                        <span className="check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="20,6 9,17 4,12" /></svg></span>
                                    ) : (
                                        <span className="cross"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <span>Multi-Chain Input Formats</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    {p.uniqueFeatures?.multiChainFormat ? (
                                        <span className="check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="20,6 9,17 4,12" /></svg></span>
                                    ) : (
                                        <span className="cross"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <span>Built-in Utility Functions</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    {p.uniqueFeatures?.utilityFunctions ? (
                                        <span className="check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="20,6 9,17 4,12" /></svg></span>
                                    ) : (
                                        <span className="cross"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <style>{`
        .table-container {
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          padding: 32px;
          margin-top: 40px;
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }
        
        .table-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
        }
        
        .table-icon {
          width: 48px;
          height: 48px;
          background: rgba(0, 255, 148, 0.1);
          border: 1px solid rgba(0, 255, 148, 0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-success);
          box-shadow: 0 0 15px rgba(0, 255, 148, 0.1);
        }
        
        .table-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }
        
        .table-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }
        
        .table-scroll {
          overflow-x: auto;
          margin: 0 -32px;
          padding: 0 32px;
          scroll-snap-type: x mandatory;
        }

        .comparison-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
          min-width: 800px; /* Ensure scroll gets triggered */
        }

        .comparison-table th,
        .comparison-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }
        
        /* Sticky First Column */
        .comparison-table th:first-child,
        .comparison-table td:first-child {
          position: sticky;
          left: 0;
          background: var(--bg-glass); /* Fallback */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 10;
          border-right: 1px solid var(--border-subtle);
        }
        
        .comparison-table th:first-child {
          z-index: 20; /* Higher than td sticky */
          background: rgba(10, 10, 10, 0.95); /* Opaque for header */
        }

        .comparison-table td:first-child {
          background: rgba(10, 10, 10, 0.85); /* Slightly opaque for legibility */
        }

        .comparison-table th:not(:first-child),
        .comparison-table td:not(:first-child) {
          scroll-snap-align: start;
        }

        .comparison-table th {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
        .comparison-table td {
          padding: 20px 16px;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          transition: background 0.2s;
        }

        .comparison-table tr:last-child td {
          border-bottom: none;
        }

        .comparison-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
        
        .provider-header-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 1rem;
          color: #fff !important;
        }
        
        .provider-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }
        
        .metric-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .metric-cell svg {
          opacity: 0.5;
          color: var(--text-tertiary);
        }
        
        .value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        
        .winner-cell {
          background: linear-gradient(90deg, rgba(0, 255, 148, 0.03), transparent);
          position: relative;
        }
        
        .winner-cell::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--accent-success);
          opacity: 0.5;
        }
        
        .winner-badge {
          display: inline-flex;
          align-items: center;
          margin-left: 8px;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          background: rgba(0, 255, 148, 0.15);
          color: var(--accent-success);
          border: 1px solid rgba(0, 255, 148, 0.2);
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .check { 
          color: var(--accent-success);
          filter: drop-shadow(0 0 8px rgba(0,255,148,0.4));
        }
        
        .cross { 
          color: var(--text-tertiary); 
          opacity: 0.2; 
        }
        
        .section-header td {
          padding: 32px 16px 16px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-codex);
          border-bottom: 1px solid var(--border-subtle);
          background: linear-gradient(90deg, rgba(138, 43, 226, 0.05), transparent);
        }
        
        .badge-success {
          background: rgba(0, 255, 148, 0.1);
          color: var(--accent-success);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(0, 255, 148, 0.1);
        }
        
        .badge-neutral {
          background: var(--bg-secondary);
          color: var(--text-tertiary);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid var(--border-subtle);
        }
      `}</style>
        </div>
    );
}

function formatCredits(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M credits`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K credits`;
    return `${num} credits`;
}
