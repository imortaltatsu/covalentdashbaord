import { useState } from 'react';
import './App.css';
import HeroSection from './components/HeroSection';
import ConfigDeck from './components/ConfigDeck';
import BenchmarkStage from './components/BenchmarkStage';
import Leaderboard from './components/Leaderboard';
import ComparisonTable from './components/ComparisonTable';
import { useBenchmark } from './hooks/useBenchmark';

function App() {
  const [iterations, setIterations] = useState(50);
  const {
    isRunning,
    progress,
    results,
    error,
    runBenchmark,
    stopBenchmark
  } = useBenchmark();

  const handleStart = () => {
    runBenchmark(iterations);
  };

  return (
    <div className="v3-app">
      <main className="story-container">
        <HeroSection />

        <ConfigDeck
          config={{ iterations }}
          setConfig={(c) => setIterations(c.iterations)}
          disabled={isRunning}
        />

        <BenchmarkStage
          isRunning={isRunning}
          progress={progress}
          error={error}
          onStart={handleStart}
          onStop={stopBenchmark}
        />

        <div className="leaderboards-container">
          <Leaderboard
            title="Scenario 1: Token Balances"
            results={results}
            testType="balanceLookup"
          />
          <Leaderboard
            title="Scenario 2: Transactions"
            results={results}
            testType="transactions"
          />
          <Leaderboard
            title="Scenario 3: NFT Metadata"
            results={results}
            testType="nftMetadata"
          />
          <Leaderboard
            title="Scenario 4: Token Prices"
            results={results}
            testType="tokenPrices"
          />
        </div>

        <ComparisonTable />
      </main>
    </div>
  );
}

export default App;
