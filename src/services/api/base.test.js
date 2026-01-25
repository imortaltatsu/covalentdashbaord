import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from './base.js';

describe('ApiClient', () => {
  let client;
  let originalFetch;

  beforeEach(() => {
    client = new ApiClient('https://api.test.com', {
      timeout: 5000,
      headers: { 'X-Test': 'value' },
    });
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('constructs with correct base URL', () => {
    expect(client.baseUrl).toBe('https://api.test.com');
  });

  it('constructs with default timeout', () => {
    const defaultClient = new ApiClient('https://api.test.com');
    expect(defaultClient.timeout).toBe(30000);
  });

  it('makes GET request with correct URL', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await client.get('/endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/endpoint',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ 'X-Test': 'value' }),
      })
    );
  });

  it('returns data and latency on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ result: 'success' }),
    });

    const result = await client.get('/test');

    expect(result.data).toEqual({ result: 'success' });
    expect(result.status).toBe(200);
    expect(typeof result.latency).toBe('number');
    expect(result.latency).toBeGreaterThanOrEqual(0);
  });

  it('throws error on HTTP error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(client.get('/missing')).rejects.toThrow('HTTP 404: Not Found');
  });

  it('includes latency in error for failed requests', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });

    try {
      await client.get('/error');
    } catch (err) {
      expect(err.status).toBe(500);
      expect(typeof err.latency).toBe('number');
    }
  });

  it('merges custom headers with default headers', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await client.get('/test', { headers: { 'X-Custom': 'custom' } });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Test': 'value',
          'X-Custom': 'custom',
        }),
      })
    );
  });
});
