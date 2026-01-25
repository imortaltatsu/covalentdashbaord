export class ApiClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.timeout = options.timeout || 30000;
    this.headers = options.headers || {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.headers, ...options.headers },
        signal: controller.signal,
      });

      const endTime = performance.now();
      const latency = endTime - startTime;

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.latency = latency;
        throw error;
      }

      const data = await response.json();
      return { data, latency, status: response.status };
    } catch (err) {
      if (err.name === 'AbortError') {
        const error = new Error('Request timeout');
        error.code = 'TIMEOUT';
        throw error;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
}
