import { formatLatency, formatThroughput } from '../services/benchmark/stats';
import { activeProviders } from '../data/providers';

export default function Leaderboard({ results, title, testType = 'balanceLookup' }) {
    // If no results yet, show skeleton/placeholder cards

    // Decide what to render: real results or placeholders
    const rows = results?.data
        ? Object.entries(results.data).map(([name, metrics]) => ({
            name,
            metrics,
            sortVal: metrics[testType]?.stats?.mean || Infinity
        })).sort((a, b) => a.sortVal - b.sortVal)
        : activeProviders.map(p => ({
            name: p.name,
            metrics: null,
            sortVal: 0
        }));

    return (
        <div className="leaderboard">
            <h2 className="section-title">{title || 'Live Results'}</h2>
            <div className="leaderboard-grid">
                {rows.map(({ name, metrics }, index) => {
                    const metricData = metrics?.[testType];
                    const hasError = metricData?.error;

                    return (
                        <div key={name} className="result-card glass-panel" style={{ '--rank-delay': `${index * 0.1}s` }}>
                            <div className="card-header">
                                <span className="provider-rank">#{index + 1}</span>
                                <h3 className="provider-name">{name}</h3>
                                {index === 0 && metricData && !hasError && <span className="trophy-icon">🏆</span>}
                            </div>

                            <div className="card-metrics">
                                <div className="metric-row">
                                    <span className="metric-label">Latency</span>
                                    <span className="metric-value text-gradient">
                                        {metricData
                                            ? (hasError ? 'Error' : formatLatency(metricData.stats?.mean))
                                            : <span className="skeleton-text">---</span>}
                                    </span>
                                </div>
                                <div className="metric-row">
                                    <span className="metric-label">Throughput</span>
                                    <span className="metric-value">
                                        {metricData
                                            ? (hasError ? '-' : formatThroughput(metricData.throughput))
                                            : <span className="skeleton-text">---</span>}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
