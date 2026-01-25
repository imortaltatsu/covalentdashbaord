import { providers } from '../data/providers';

export default function ComparisonTable() {
    const features = [
        { key: 'sdk', label: 'TypeScript SDK' },
        { key: 'websocket', label: 'WebSocket Support' },
        { key: 'restApi', label: 'REST API' },
        { key: 'historicalData', label: 'Historical Data' },
        { key: 'nftSupport', label: 'NFT Support' },
        { key: 'defiSupport', label: 'DeFi Support' },
        { key: 'crossChain', label: 'Cross-Chain' },
    ];

    const getWinner = (key) => {
        if (key === 'chainsCount') return 'covalent';
        if (key === 'rateLimit') return 'mobula';
        if (key === 'startingPrice') return 'alchemy';
        return null;
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <div className="table-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3h18v18H3z" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                    </svg>
                </div>
                <div>
                    <h3 className="table-title">Detailed Comparison</h3>
                    <p className="table-subtitle">Side-by-side comparison of all features and metrics</p>
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
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                    className={getWinner('startingPrice') === p.id ? 'winner-cell' : ''}
                                >
                                    <span className="value" style={{ color: getWinner('startingPrice') === p.id ? p.color : 'inherit' }}>
                                        ${p.metrics.startingPrice}/mo
                                    </span>
                                    {getWinner('startingPrice') === p.id && <span className="winner-badge">Best</span>}
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
                                        {p.metrics.rateLimit === 999 ? 'Unlimited' : `${p.metrics.rateLimit} RPS`}
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
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 3v18h18" />
                                        <path d="M18 9l-5 5-4-4-6 6" />
                                    </svg>
                                    <span>Historical Data Depth</span>
                                </div>
                            </td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="value">{p.historicalDataDepth}</span>
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
                                    <span>Time-to-First-Value</span>
                                </div>
                            </td>
                            {providers.map(p => {
                                const isBest = p.ttfv === Math.min(...providers.map(pr => pr.ttfv));
                                return (
                                    <td key={p.id} className={isBest ? 'winner-cell' : ''}>
                                        <span className="value" style={{ color: isBest ? p.color : 'inherit' }}>
                                            {p.ttfv}ms
                                        </span>
                                        {isBest && <span className="winner-badge">Best</span>}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr>
                            <td>
                                <div className="metric-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

                        {/* Feature rows */}
                        <tr className="section-header">
                            <td colSpan={providers.length + 1}>
                                <strong>Features</strong>
                            </td>
                        </tr>
                        {features.map(feature => (
                            <tr key={feature.key}>
                                <td>
                                    <div className="metric-cell">
                                        <span>{feature.label}</span>
                                    </div>
                                </td>
                                {providers.map(p => (
                                    <td key={p.id}>
                                        {p.features[feature.key] ? (
                                            <span className="check">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                            </span>
                                        ) : (
                                            <span className="cross">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        .table-container {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
        }
        
        .table-header {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }
        
        .table-icon {
          width: 32px;
          height: 32px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-success);
          flex-shrink: 0;
        }
        
        .table-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .table-subtitle {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }
        
        .table-scroll {
          overflow-x: auto;
        }
        
        .provider-header-cell {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-weight: 600;
        }
        
        .provider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .metric-cell {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-secondary);
        }
        
        .metric-cell svg {
          opacity: 0.6;
        }
        
        .value {
          font-weight: 600;
        }
        
        .winner-cell {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
        }
        
        .winner-badge {
          display: inline-block;
          margin-left: var(--spacing-xs);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 6px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-success);
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }
        
        .check {
          color: var(--accent-success);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cross {
          color: var(--text-muted);
          opacity: 0.4;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .section-header {
          background: rgba(255, 255, 255, 0.02);
        }
        
        .section-header td {
          padding: var(--spacing-md) var(--spacing-lg);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
        
        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-success);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .badge-neutral {
          background: rgba(139, 92, 246, 0.15);
          color: var(--color-mobula);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
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
