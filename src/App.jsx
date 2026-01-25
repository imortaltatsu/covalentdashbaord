import './App.css';
import ProviderCard from './components/ProviderCard';
import ComparisonTable from './components/ComparisonTable';
import BenchmarkRunner from './components/BenchmarkRunner';
import { providers } from './data/providers';

function App() {
  // Calculate totals
  const totalChains = providers.reduce((sum, p) => sum + p.metrics.chainsCount, 0);
  const avgRPS = Math.round(providers.reduce((sum, p) => sum + (p.metrics.rateLimit === 999 ? 100 : p.metrics.rateLimit), 0) / providers.length);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">CV</div>
          <span className="brand-text">Covalent</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#overview" className="nav-item active">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            Overview
          </a>
          <a href="#providers" className="nav-item">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            Providers
          </a>
          <a href="#benchmark" className="nav-item">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            Benchmark
          </a>
          <a href="#comparison" className="nav-item">
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
            </span>
            Comparison
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="update-text">Last updated</span>
          <span className="update-date">Jan 2026</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>API Provider Benchmark</h1>
            <p className="header-subtitle">Live performance comparison</p>
          </div>
        </header>

        {/* Quick Stats */}
        <section id="overview" className="quick-stats">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Total Providers</span>
              <div className="stat-icon providers-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <div className="stat-value">3</div>
            <div className="stat-change positive">Active APIs</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Combined Chains</span>
              <div className="stat-icon chains-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
            </div>
            <div className="stat-value">{totalChains}+</div>
            <div className="stat-change">Blockchains indexed</div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-card-header">
              <span className="stat-label">Leader: Chain Coverage</span>
              <div className="stat-icon crown-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
            </div>
            <div className="stat-value" style={{ color: 'var(--color-covalent)' }}>Covalent</div>
            <div className="stat-change positive">225+ chains</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Avg Rate Limit</span>
              <div className="stat-icon speed-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                </svg>
              </div>
            </div>
            <div className="stat-value">{avgRPS}</div>
            <div className="stat-change">Requests/sec</div>
          </div>
        </section>

        {/* Provider Cards */}
        <section id="providers" className="providers-grid">
          <div className="section-header-inline">
            <h2>Provider Overview</h2>
          </div>
          <div className="cards-grid">
            {providers.map((provider, index) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isLeader={index === 0}
              />
            ))}
          </div>
        </section>

        {/* Live Benchmark */}
        <section id="benchmark" className="benchmark-grid">
          <BenchmarkRunner />
        </section>

        {/* Comparison Table */}
        <section id="comparison" className="table-section">
          <ComparisonTable />
        </section>
      </main>
    </div>
  );
}

export default App;
