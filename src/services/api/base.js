export class RateLimiter {
    constructor(requestsPerWindow, windowMs) {
        this.maxTokens = requestsPerWindow;
        this.tokens = requestsPerWindow;
        this.lastRefill = Date.now();
        this.refillRate = requestsPerWindow / windowMs;
    }

    async acquire() {
        this.refill();

        if (this.tokens < 1) {
            const waitTime = (1 - this.tokens) / this.refillRate;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            this.refill();
        }

        this.tokens -= 1;
    }

    refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        this.tokens = Math.min(this.maxTokens, this.tokens + (elapsed * this.refillRate));
        this.lastRefill = now;
    }
}

export async function measureRequest(requestFn, options = {}) {
    const {
        timeoutMs = 30000,
        retries = 0,
        baseDelayMs = 250,
        maxDelayMs = 4000
    } = options;

    let attemptCount = 0;
    let lastError = null;

    while (attemptCount <= retries) {
        const startTime = performance.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await requestFn(controller.signal);
            const ttfb = performance.now() - startTime;

            clearTimeout(timeoutId);

            if (!response.ok) {
                const latency = performance.now() - startTime;
                if (response.status === 429 || response.status >= 500) {
                    if (attemptCount < retries) {
                        attemptCount++;
                        const backoff = Math.min(baseDelayMs * Math.pow(2, attemptCount), maxDelayMs);
                        await new Promise(resolve => setTimeout(resolve, backoff));
                        continue;
                    }
                }

                const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
                err.status = response.status;
                err.latency = latency;
                err.ttfb = ttfb;
                throw err;
            }

            // Measure payload size using cloned response
            const clone = response.clone();
            const text = await clone.text();
            const payloadSize = new TextEncoder().encode(text).length;

            const data = await response.json();
            const latency = performance.now() - startTime;

            return {
                data,
                latency,
                ttfb,
                payloadSize,
                status: response.status
            };
        } catch (err) {
            clearTimeout(timeoutId);
            const latency = performance.now() - startTime;
            lastError = err;
            if (!err.latency) err.latency = latency;

            if (attemptCount < retries) {
                attemptCount++;
                const backoff = Math.min(baseDelayMs * Math.pow(2, attemptCount), maxDelayMs);
                await new Promise(resolve => setTimeout(resolve, backoff));
                continue;
            }
            throw err;
        }
    }
    throw lastError;
}
