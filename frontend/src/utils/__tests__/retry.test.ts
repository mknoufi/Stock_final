import { retryWithBackoff } from '../retry';

describe('retryWithBackoff', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should return result immediately if operation succeeds', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(operation);
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually return success', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValue('success');

    const promise = retryWithBackoff(operation, { retries: 2, backoffMs: 100 });

    // Advance time for the first retry (100 * 2^0 = 100ms)
    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('should throw last error if max retries reached', async () => {
    const error = new Error('persistent fail');
    const operation = jest.fn().mockRejectedValue(error);
    const retries = 3;
    const backoffMs = 10;

    const promise = retryWithBackoff(operation, { retries, backoffMs });

    // Capture the expectation promise before running timers to avoid unhandled rejection
    const expectation = expect(promise).rejects.toThrow('persistent fail');

    await jest.runAllTimersAsync();

    await expectation;
    expect(operation).toHaveBeenCalledTimes(retries);
  });

  it('should respect custom shouldRetry logic', async () => {
    const error = new Error('Do Not Retry');
    const operation = jest.fn().mockRejectedValue(error);
    const shouldRetry = jest.fn().mockReturnValue(false);

    const promise = retryWithBackoff(operation, { shouldRetry });

    await expect(promise).rejects.toThrow('Do Not Retry');
    expect(operation).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledWith(error);
  });

  it('should use exponential backoff delay', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');

    const backoffMs = 100;
    const retries = 3;

    const promise = retryWithBackoff(operation, { retries, backoffMs });

    // Initial call
    expect(operation).toHaveBeenCalledTimes(1);

    // Advance just short of first retry delay (100ms)
    await jest.advanceTimersByTimeAsync(50);
    expect(operation).toHaveBeenCalledTimes(1);

    // Complete first retry delay
    await jest.advanceTimersByTimeAsync(50);
    expect(operation).toHaveBeenCalledTimes(2); // Should have retried once

    // Advance just short of second retry delay (200ms)
    await jest.advanceTimersByTimeAsync(100);
    expect(operation).toHaveBeenCalledTimes(2);

    // Complete second retry delay
    await jest.advanceTimersByTimeAsync(100);
    expect(operation).toHaveBeenCalledTimes(3); // Should have retried twice

    await promise;
  });

  it('default shouldRetry should not retry on 4xx errors', async () => {
    const error404 = new Error('Not Found');
    (error404 as any).response = { status: 404 };

    const operation = jest.fn().mockRejectedValue(error404);

    await expect(retryWithBackoff(operation)).rejects.toThrow('Not Found');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('default shouldRetry should retry on 5xx errors', async () => {
    const error500 = new Error('Server Error');
    (error500 as any).response = { status: 500 };

    const operation = jest.fn()
      .mockRejectedValueOnce(error500)
      .mockResolvedValue('success');

    const promise = retryWithBackoff(operation, { backoffMs: 10 });

    await jest.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('default shouldRetry should retry on network errors (no status)', async () => {
    const networkError = new Error('Network Error');
    // No response property

    const operation = jest.fn()
      .mockRejectedValueOnce(networkError)
      .mockResolvedValue('success');

    const promise = retryWithBackoff(operation, { backoffMs: 10 });

    await jest.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
