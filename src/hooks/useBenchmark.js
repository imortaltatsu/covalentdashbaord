import { useState, useCallback, useRef } from 'react';
import { createBenchmarkRunner, TestType } from '../services/benchmark/index.js';
import { getCovalentClient, getAlchemyClient, getMobulaClient } from '../services/api/index.js';

const STORAGE_KEY = 'benchmark_results';

function loadCachedResults() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function saveCachedResults(results) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Storage full or unavailable
  }
}

function resetClientInstances() {
  // Force new client instances with fresh config
  return [
    { name: 'covalent', client: getCovalentClient() },
    { name: 'alchemy', client: getAlchemyClient() },
    { name: 'mobula', client: getMobulaClient() },
  ];
}

export function useBenchmark() {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState(loadCachedResults);
  const [error, setError] = useState(null);
  const runnerRef = useRef(null);
  const resultsRef = useRef({});

  const runBenchmark = useCallback(async (iterations = 10) => {
    setStatus('running');
    setError(null);
    resultsRef.current = {};

    const providers = resetClientInstances();
    const configuredProviders = providers.filter(p => p.client.isConfigured());

    if (configuredProviders.length === 0) {
      setError('No API keys configured. Add keys to .env file.');
      setStatus('error');
      return;
    }

    const testsPerProvider = Object.keys(TestType).length;
    const totalTests = configuredProviders.length * testsPerProvider;
    const totalRequests = totalTests * iterations;
    let completedTests = 0;

    const updateResults = (providerName, testType, testResult) => {
      if (!resultsRef.current[providerName]) {
        resultsRef.current[providerName] = {};
      }
      resultsRef.current[providerName][testType] = testResult;

      setResults({
        data: { ...resultsRef.current },
        timestamp: Date.now(),
        iterations,
        inProgress: true,
      });
    };

    const runner = createBenchmarkRunner({
      iterations,
      onProgress: (prog) => {
        // Global request-level progress across all providers and test types:
        // e.g. 3 providers * 4 tests * 10 iterations = 120 total requests
        const completedRequests = (completedTests * iterations) + prog.iteration;

        setProgress({
          provider: prog.provider,
          testType: prog.testType,
          iteration: completedRequests,
          total: totalRequests,
          completedTests,
          totalTests,
          perTestIteration: prog.iteration,
          perTestTotal: prog.total,
        });
      },
      onResult: (result) => {
        completedTests++;
        updateResults(result.provider, result.testType, result);
      },
    });

    runnerRef.current = runner;

    try {
      await runner.runAllTests(configuredProviders);
      const finalResults = {
        data: { ...resultsRef.current },
        timestamp: Date.now(),
        iterations,
        inProgress: false,
      };
      setResults(finalResults);
      saveCachedResults(finalResults);
      setStatus('complete');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  const stopBenchmark = useCallback(() => {
    if (runnerRef.current) {
      runnerRef.current.abort();
      setStatus('stopped');
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    resultsRef.current = {};
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    status,
    progress,
    results,
    error,
    runBenchmark,
    stopBenchmark,
    clearResults,
    isRunning: status === 'running',
    hasResults: results !== null,
  };
}
