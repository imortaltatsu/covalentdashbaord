export default function ProviderCard({ provider, isLeader = false }) {
  const { name, initials, tagline, description, color, gradient, metrics } = provider;

  const maxChains = 225; // Covalent has the most
  const chainsPercent = (metrics.chainsCount / maxChains) * 100;

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div
      className="card provider-card"
      style={{
        '--provider-color': color,
        '--provider-gradient': gradient,
      }}
    >
      {isLeader && (
        <div className="leader-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
          <span>Leader</span>
        </div>
      )}

      <div className="provider-header">
        <div className="provider-logo" style={{ background: gradient }}>
          <span>{initials}</span>
        </div>
        <div className="provider-info">
          <h3 className="provider-name">{name}</h3>
          <span className="provider-tagline">{tagline}</span>
        </div>
      </div>

      <p className="provider-description">{description}</p>

      <div className="provider-stats">
        <div className="stat-item">
          <span className="stat-value" style={{ color }}>
            {metrics.chainsCount}+
          </span>
          <span className="stat-label">Chains</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color }}>
            {formatNumber(metrics.freeTierCredits)}
          </span>
          <span className="stat-label">Free Credits</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color }}>
            {metrics.rateLimit === 999 ? '∞' : metrics.rateLimit}
          </span>
          <span className="stat-label">RPS</span>
        </div>
      </div>

      <div className="chains-progress">
        <div className="progress-header">
          <span>Chain Coverage</span>
          <span style={{ color }}>{Math.round(chainsPercent)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{
              width: `${chainsPercent}%`,
              background: gradient,
            }}
          />
        </div>
      </div>

      <style>{`
        .provider-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          overflow: hidden;
        }
        
        .provider-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--provider-gradient);
        }
        
        .leader-badge {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15));
          border: 1px solid rgba(255, 215, 0, 0.3);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-weight: 600;
          color: #fbbf24;
        }
        
        .provider-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .provider-logo {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          font-weight: 800;
          font-size: 1rem;
          color: white;
        }
        
        .provider-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .provider-name {
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        .provider-tagline {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .provider-description {
          color: var(--text-secondary);
          font-size: 0.8rem;
          line-height: 1.5;
        }
        
        .provider-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-sm);
          padding: var(--spacing-md) 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-item .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
        }
        
        .stat-item .stat-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .chains-progress {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
      `}</style>
    </div>
  );
}
