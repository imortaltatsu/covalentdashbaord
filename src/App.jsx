import { useState } from 'react';
import './App.css';
import HeroSection from './components/HeroSection';
import ConfigDeck from './components/ConfigDeck';
import BenchmarkStage from './components/BenchmarkStage';
import Leaderboard from './components/Leaderboard';
import ComparisonTable from './components/ComparisonTable';
import { useBenchmark } from './hooks/useBenchmark';

function App() {
  const [iterations, setIterations] = useState(10);
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

        <Leaderboard results={results} />

        <ComparisonTable />
      </main>
    </div>
  );
}

export default App;
