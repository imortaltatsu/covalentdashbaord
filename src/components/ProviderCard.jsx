import { activeProviders as providers } from '../data/providers';

function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

export default function ProviderCard({ provider, isLeader = false }) {
  const { name, initials, tagline, description, color, gradient, metrics } = provider;

  const maxChains = 225; // Covalent has the most
  const chainsPercent = (metrics.chainsCount / maxChains) * 100;

  return (
    <div
      className="glass-card provider-card"
      style={{
        '--provider-color': color,
        '--provider-gradient': gradient,
      }}
    >
      {isLeader && (
        <div className="leader-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
          <span>Market Leader</span>
        </div>
      )}

      <div className="provider-header">
        <div className="provider-logo-container">
          <div className="provider-logo" style={{ background: gradient }}>
            <span>{initials}</span>
          </div>
          <div className="logo-glow" style={{ background: color }}></div>
        </div>
        <div className="provider-info">
          <h3 className="provider-name">{name}</h3>
          <span className="provider-tagline">{tagline}</span>
        </div>
      </div>

      <p className="provider-description">{description}</p>

      <div className="provider-stats">
        <div className="stat-item">
          <span className="stat-value">{metrics.chainsCount}+</span>
          <span className="stat-label">Chains</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{formatNumber(metrics.freeTierCredits)}</span>
          <span className="stat-label">Free Credits</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{metrics.rateLimit === 999 ? '∞' : metrics.rateLimit}</span>
          <span className="stat-label">RPS</span>
        </div>
      </div>

      <div className="chains-progress">
        <div className="progress-header">
          <span>Chain Coverage</span>
          <span className="coverage-value">{Math.round(chainsPercent)}%</span>
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
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          border-top: 2px solid var(--provider-color);
        }
        
        .leader-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #FFD700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .provider-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .provider-logo-container {
          position: relative;
          width: 52px;
          height: 52px;
        }
        
        .provider-logo {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          font-weight: 800;
          font-size: 1.1rem;
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          filter: blur(15px);
          opacity: 0.4;
          z-index: 1;
        }
        
        .provider-name {
          font-size: 1.35rem;
          font-weight: 800;
          margin-bottom: 2px;
        }
        
        .provider-tagline {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--provider-color);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .provider-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          min-height: 3.2em;
        }
        
        .provider-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-sm);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-subtle);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .stat-item .stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        
        .stat-item .stat-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .coverage-value {
          font-weight: 700;
          color: var(--provider-color);
        }
      `}</style>
    </div>
  );
}
