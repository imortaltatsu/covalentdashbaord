const TEST_LABELS = {
    balanceLookup: 'Balance Lookup',
    transactions: 'Transactions',
    nftMetadata: 'NFT Metadata',
    tokenPrices: 'Token Prices',
};

export default function BenchmarkStage({ isRunning, progress, error, onStart, onStop }) {
    const percentage = progress
        ? Math.min(100, (progress.completedRequests / progress.totalRequests) * 100)
        : 0;

    const currentTest = progress?.testType ? (TEST_LABELS[progress.testType] || progress.testType) : 'Initializing...';

    return (
        <div className="benchmark-stage-container">
            {error && (
                <div className="error-toast">
                    ⚠️ {error}
                </div>
            )}

            <div className="benchmark-stage">
                {!isRunning ? (
                    <button className="start-btn-large" onClick={onStart}>
                        <span className="btn-text">Start Benchmark</span>
                        <div className="btn-glow"></div>
                    </button>
                ) : (
                    <div className="running-stage">
                        <div className="progress-track">
                            <div
                                className="progress-bar"
                                style={{ width: `${percentage}%` }}
                            >
                                <div className="progress-spark"></div>
                            </div>
                        </div>
                        <div className="status-row">
                            <span className="status-text">
                                <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>{currentTest}</span>
                                <span style={{ opacity: 0.5, margin: '0 8px' }}>|</span>
                                Request {progress?.completedRequests || 0} / {progress?.totalRequests || 0}
                            </span>
                            <button className="stop-btn-text" onClick={onStop}>Stop</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
