export default function ConfigDeck({ config, setConfig, disabled }) {
    const options = [10, 50, 100];

    return (
        <div className="config-deck">
            <div className="config-group">
                <span className="config-label">Iterations</span>
                <div className="pill-selector">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            className={`pill-btn ${config.iterations === opt ? 'active' : ''}`}
                            onClick={() => setConfig({ ...config, iterations: opt })}
                            disabled={disabled}
                        >
                            {opt} Runs
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
