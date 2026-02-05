import { activeProviders } from '../data/providers';

export default function HeroSection() {
    const providerCount = activeProviders.length;
    const totalChains = activeProviders.reduce((acc, p) => acc + p.metrics.chainsCount, 0);

    return (
        <section className="hero-section">
            <div className="hero-badge">API Performance Benchmark</div>
            <h1 className="hero-title">
                The Fastest Data <br />
                <span className="text-gradient">Wins the User.</span>
            </h1>
            <p className="hero-subtitle">
                Real-time latency, throughput, and reliability metrics across the top Web3 data providers.
            </p>

            <div className="hero-stats">
                <div className="stat-pill">
                    <span className="stat-val">{providerCount}</span>
                    <span className="stat-lbl">Providers</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-pill">
                    <span className="stat-val">{totalChains}+</span>
                    <span className="stat-lbl">Chains</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-pill">
                    <span className="stat-val">Live</span>
                    <span className="stat-lbl">Comparison</span>
                    <span className="stat-dot"></span>
                </div>
            </div>
        </section>
    );
}
