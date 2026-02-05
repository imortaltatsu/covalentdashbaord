import { activeProviders as providers } from '../data/providers';

const WinnerBadge = ({ type }) => (
    <span className={`badge ${type === 'best' ? 'badge-best' : 'badge-free'}`}>
        {type === 'best' ? 'Best' : 'Free Tier'}
    </span>
);

const BooleanCell = ({ isTrue }) => (
    <div className={`bool-icon ${isTrue ? 'bool-true' : 'bool-false'}`}>
        {isTrue ? '✓' : '—'}
    </div>
);

export default function ComparisonTable() {
    const getWinner = (key) => {
        if (key === 'chainsCount') return 'covalent';
        // Mobula has unlimited, so it wins rate limit
        if (key === 'rateLimit') return 'mobula';
        // Shared win for historical data
        if (key === 'historicalDataYears') return ['covalent', 'alchemy'];
        return null;
    };

    const isWinner = (providerId, key) => {
        const winner = getWinner(key);
        if (Array.isArray(winner)) return winner.includes(providerId);
        return winner === providerId;
    };

    const hasFreeTier = (p) => p.metrics.startingPrice === 0;

    return (
        <div className="table-container fade-in-up">
            <div className="table-header-row">
                <h3 className="table-heading">Provider Analysis</h3>
                <p className="table-subheading">Technical Capability Comparison</p>
            </div>

            <div className="table-wrapper">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th className="sticky-col">Metric</th>
                            {providers.map(p => (
                                <th key={p.id}>
                                    <div className="th-content">
                                        <div className="provider-dot" style={{ background: p.color }} />
                                        <span style={{ color: p.color }}>{p.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Chains */}
                        <tr>
                            <td className="sticky-col">Chains Covered</td>
                            {providers.map(p => (
                                <td key={p.id} className={isWinner(p.id, 'chainsCount') ? 'highlight-cell' : ''}>
                                    <span className="cell-value">{p.metrics.chainsCount}+</span>
                                    {isWinner(p.id, 'chainsCount') && <WinnerBadge type="best" />}
                                </td>
                            ))}
                        </tr>

                        {/* Starting Price */}
                        <tr>
                            <td className="sticky-col">Starting Price</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="cell-value">
                                        {p.metrics.startingPrice === 0 ? 'Free' : `$${p.metrics.startingPrice}`}
                                    </span>
                                    {hasFreeTier(p) && <WinnerBadge type="free" />}
                                </td>
                            ))}
                        </tr>

                        {/* Rate Limit */}
                        <tr>
                            <td className="sticky-col">Rate Limit (RPS)</td>
                            {providers.map(p => (
                                <td key={p.id} className={isWinner(p.id, 'rateLimit') ? 'highlight-cell' : ''}>
                                    <span className="cell-value">
                                        {p.metrics.rateLimit ? `${p.metrics.rateLimit} RPS` : 'Unlimited'}
                                    </span>
                                    {isWinner(p.id, 'rateLimit') && <WinnerBadge type="best" />}
                                </td>
                            ))}
                        </tr>

                        {/* Free Credits */}
                        <tr>
                            <td className="sticky-col">Free Tier Units</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="cell-value-secondary">{formatCredits(p.metrics.freeTierCredits)}</span>
                                </td>
                            ))}
                        </tr>

                        {/* Endpoints */}
                        <tr>
                            <td className="sticky-col">API Endpoints</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="cell-value">{p.metrics.endpoints}+</span>
                                </td>
                            ))}
                        </tr>

                        {/* Data Freshness */}
                        <tr>
                            <td className="sticky-col">Data Freshness</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="freshness-tag">{p.metrics.dataFreshness}</span>
                                </td>
                            ))}
                        </tr>

                        {/* SDKs */}
                        <tr>
                            <td className="sticky-col">SDK Support</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="cell-text-sm">{p.metrics.sdkLanguages}</span>
                                </td>
                            ))}
                        </tr>

                        {/* Uptime */}
                        <tr>
                            <td className="sticky-col">SLA Uptime</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className="uptime-tag">{p.metrics.slaUptime}</span>
                                </td>
                            ))}
                        </tr>

                        {/* Historical Data */}
                        <tr>
                            <td className="sticky-col">History Depth</td>
                            {providers.map(p => (
                                <td key={p.id} className={isWinner(p.id, 'historicalDataYears') ? 'highlight-cell' : ''}>
                                    <span className="cell-value">{p.historicalDataYears}+ Years</span>
                                    {isWinner(p.id, 'historicalDataYears') && <WinnerBadge type="best" />}
                                </td>
                            ))}
                        </tr>

                        {/* Normalization */}
                        <tr>
                            <td className="sticky-col">Schema Quality</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <span className={`quality-tag ${p.schemaNormalization.toLowerCase()}`}>
                                        {p.schemaNormalization}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* SECTION: Unique Caps */}
                        <tr className="section-spacer"><td colSpan={providers.length + 1}></td></tr>
                        <tr className="section-row">
                            <td className="sticky-col">Unique Capabilities</td>
                            <td colSpan={providers.length}></td>
                        </tr>

                        <tr>
                            <td className="sticky-col">Name Resolution</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <BooleanCell isTrue={!!p.uniqueFeatures?.nameResolution} />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="sticky-col">Real-time Stream</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <BooleanCell isTrue={!!p.uniqueFeatures?.realtimeStreaming} />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="sticky-col">Auto-Pagination</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <BooleanCell isTrue={!!p.uniqueFeatures?.autoPagination} />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="sticky-col">Multi-Chain Input</td>
                            {providers.map(p => (
                                <td key={p.id}>
                                    <BooleanCell isTrue={!!p.uniqueFeatures?.multiChainFormat} />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <style>{`
                .table-container {
                    margin-top: 60px;
                    border: 1px solid var(--border-subtle);
                    border-radius: 24px;
                    background: var(--bg-glass);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    backdrop-filter: blur(20px);
                }

                .table-header-row {
                    padding: 32px;
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom: 1px solid var(--border-subtle);
                }

                .table-heading {
                    margin: 0;
                    font-size: 1.25rem;
                    color: #fff;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                }

                .table-subheading {
                    margin: 4px 0 0 0;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                .table-wrapper {
                    overflow-x: auto;
                    width: 100%;
                }

                .glass-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    min-width: 800px;
                }

                .glass-table th, .glass-table td {
                    padding: 18px 24px;
                    text-align: left;
                    border-bottom: 1px solid var(--border-subtle);
                    vertical-align: middle;
                }

                /* Sticky First Column */
                .sticky-col {
                    position: sticky;
                    left: 0;
                    background: #0A0A0A; /* Needs opaque bg to hide scroll under */
                    z-index: 10;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                    border-right: 1px solid var(--border-subtle);
                    min-width: 200px;
                }

                .glass-table th.sticky-col {
                    background: #0F0F0F;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    color: var(--text-tertiary);
                    z-index: 20;
                }

                /* Provider Headers */
                .th-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .provider-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    box-shadow: 0 0 8px currentColor;
                }

                /* Cells */
                .cell-value {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.95rem;
                    color: #fff;
                    font-weight: 500;
                }

                .cell-value-secondary {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .cell-text-sm {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                /* Highlight Winner */
                .highlight-cell {
                    background: linear-gradient(90deg, rgba(255, 255, 255, 0.03), transparent);
                }

                /* Badges */
                .badge {
                    display: inline-block;
                    margin-left: 10px;
                    padding: 3px 8px;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    vertical-align: middle;
                }

                .badge-best {
                    color: #FFD700;
                    background: rgba(255, 215, 0, 0.1);
                    border: 1px solid rgba(255, 215, 0, 0.2);
                }

                .badge-free {
                    color: var(--accent-success);
                    background: rgba(0, 255, 148, 0.1);
                    border: 1px solid rgba(0, 255, 148, 0.2);
                }

                /* Tags */
                .freshness-tag, .uptime-tag {
                    font-size: 0.8rem;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                }
                
                .uptime-tag {
                    color: var(--accent-success);
                    background: rgba(0, 255, 148, 0.05);
                }

                /* Quality Tags */
                .quality-tag {
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 100px;
                }
                .quality-tag.high {
                    background: rgba(138, 43, 226, 0.15);
                    color: var(--accent-codex);
                    border: 1px solid rgba(138, 43, 226, 0.2);
                }
                .quality-tag.medium {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-secondary);
                    border: 1px solid var(--border-subtle);
                }

                /* Boolean Icons */
                .bool-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    font-weight: bold;
                }
                .bool-true {
                    color: var(--accent-success);
                    background: rgba(0, 255, 148, 0.1);
                }
                .bool-false {
                    color: var(--text-tertiary);
                    opacity: 0.3;
                }

                /* Sections */
                .section-spacer td {
                    border: none;
                    padding: 8px;
                    background: rgba(0,0,0,0.2);
                }
                .section-row td {
                    background: rgba(255, 255, 255, 0.02);
                    font-weight: 700;
                    color: var(--text-primary);
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.1em;
                    padding-top: 24px;
                }
                .section-row .sticky-col {
                    background: #0F0F0F; /* Slightly lighter than regular sticky */
                }

                @media (max-width: 768px) {
                    .table-container {
                        margin-top: 40px;
                        border-radius: 16px;
                    }
                }
            `}</style>
        </div>
    );
}

function formatCredits(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
}
