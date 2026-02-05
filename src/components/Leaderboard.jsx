import { formatLatency, formatThroughput } from '../services/benchmark/stats';
import { activeProviders } from '../data/providers';

export default function Leaderboard({ results }) {
    // If no results yet, show skeleton/placeholder cards

    // Decide what to render: real results or placeholders
    const rows = results?.data
        ? Object.entries(results.data).map(([name, metrics]) => ({
            name,
            metrics,
            sortVal: metrics.balanceLookup?.stats?.mean || Infinity
        })).sort((a, b) => a.sortVal - b.sortVal)
        : activeProviders.map(p => ({
            name: p.name,
            metrics: null,
            sortVal: 0
        }));

    return (
        <div className="leaderboard">
            <h2 className="section-title">Live Results</h2>
            <div className="leaderboard-grid">
                {rows.map(({ name, metrics }, index) => (
                    <div key={name} className="result-card glass-panel" style={{ '--rank-delay': `${index * 0.1}s` }}>
                        <div className="card-header">
                            <span className="provider-rank">#{index + 1}</span>
                            <h3 className="provider-name">{name}</h3>
                            {index === 0 && metrics && <span className="trophy-icon">🏆</span>}
                        </div>

                        <div className="card-metrics">
                            <div className="metric-row">
                                <span className="metric-label">Latency</span>
                                <span className="metric-value text-gradient">
                                    {metrics
                                        ? (metrics.balanceLookup?.error ? 'Error' : formatLatency(metrics.balanceLookup?.stats?.mean))
                                        : <span className="skeleton-text">---</span>}
                                </span>
                            </div>
                            <div className="metric-row">
                                <span className="metric-label">Throughput</span>
                                <span className="metric-value">
                                    {metrics
                                        ? (metrics.balanceLookup?.error ? '-' : formatThroughput(metrics.balanceLookup?.throughput))
                                        : <span className="skeleton-text">---</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="payload-note-v3">
                <div className="note-icon">ℹ️</div>
                <p>
                    <strong>Note on Payload:</strong> GoldRush/Mobula return enriched data (MBs) by default.
                    Alchemy returns raw hex (KBs) here; enriched data requires extra calls/SDK.
                </p>
            </div>
        </div>
    );
}
