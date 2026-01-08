/**
 * Advanced Amazon Email Validator dengan features production-ready
 * - Caching
 * - Rate limiting
 * - Retry logic
 * - Logging
 */

const { validateAmazonEmail } = require('./amazonEmailValidator');

class AdvancedAmazonValidator {
  constructor(options = {}) {
    this.cache = new Map();
    this.cacheDuration = options.cacheDuration || 3600000; // 1 hour
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // 1 second
    this.rateLimitPerMinute = options.rateLimitPerMinute || 30;
    this.requestLog = [];
    this.enableLogging = options.enableLogging !== false;
  }

  /**
   * Log activity untuk debugging
   */
  log(level, message, data = {}) {
    if (!this.enableLogging) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
    this.requestLog.push(logEntry);
  }

  /**
   * Check rate limit
   */
  checkRateLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove old requests outside 1 minute window
    this.requestLog = this.requestLog.filter(
      log => new Date(log.timestamp).getTime() > oneMinuteAgo
    );

    if (this.requestLog.length >= this.rateLimitPerMinute) {
      this.log('warn', 'Rate limit exceeded', {
        currentRequests: this.requestLog.length,
        limit: this.rateLimitPerMinute
      });
      throw new Error(`Rate limit exceeded: ${this.rateLimitPerMinute} requests per minute`);
    }
  }

  /**
   * Get dari cache
   */
  getFromCache(email) {
    const cached = this.cache.get(email);

    if (!cached) return null;

    const now = Date.now();
    const age = now - cached.timestamp;

    if (age > this.cacheDuration) {
      this.cache.delete(email);
      this.log('info', 'Cache expired', { email, ageMs: age });
      return null;
    }

    this.log('info', 'Cache hit', { email, ageMs: age });
    return cached.result;
  }

  /**
   * Store ke cache
   */
  setCache(email, result) {
    this.cache.set(email, {
      result,
      timestamp: Date.now()
    });
    this.log('debug', 'Cached result', { email });
  }

  /**
   * Retry logic dengan exponential backoff
   */
  async retryWithBackoff(fn, retryCount = 0) {
    try {
      return await fn();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount); // exponential backoff
        this.log('warn', `Retry ${retryCount + 1}/${this.maxRetries}`, {
          error: error.message,
          delayMs: delay
        });

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryWithBackoff(fn, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Main validation function
   */
  async validate(email, options = {}) {
    try {
      const { proxy = null } = options;
      // Check rate limit
      this.checkRateLimit();

      // Check cache
      const cachedResult = this.getFromCache(email);
      if (cachedResult) {
        return cachedResult;
      }

      // Validate dengan retry
      this.log('info', 'Validating email', { email });
      const result = await this.retryWithBackoff(
        () => validateAmazonEmail(email, { proxy })
      );

      // Cache result
      this.setCache(email, result);

      this.log('info', 'Validation complete', {
        email,
        isRegistered: result.isRegistered,
        proxyEnabled: !!proxy
      });

      return result;
    } catch (error) {
      this.log('error', 'Validation failed', {
        email,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Batch validation dengan built-in rate limiting
   */
  async validateBatch(emails, options = {}) {
    const { delayMs = 1000, stopOnError = false, proxy = null, proxies = [] } = options;
    const results = [];

    const rotationEnabled = Array.isArray(proxies) && proxies.length > 0;

    this.log('info', 'Starting batch validation', {
      emailCount: emails.length,
      delayMs,
      stopOnError,
      proxyEnabled: !!proxy,
      proxyRotation: rotationEnabled ? proxies.length : 0
    });

    for (let i = 0; i < emails.length; i++) {
      try {
        const email = emails[i];
        const proxyForThisEmail = rotationEnabled
          ? proxies[i % proxies.length]
          : proxy;

        const result = await this.validate(email, { proxy: proxyForThisEmail });
        results.push({
          email,
          ...result,
          index: i
        });

        // Delay between requests
        if (i < emails.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        const errorResult = {
          email: emails[i],
          isRegistered: false,
          message: error.message,
          statusCode: 500,
          index: i,
          error: true
        };

        results.push(errorResult);

        if (stopOnError) {
          this.log('warn', 'Batch validation stopped on error', {
            stoppedAt: i,
            totalProcessed: i + 1
          });
          break;
        }
      }
    }

    this.log('info', 'Batch validation complete', {
      totalProcessed: results.length,
      registered: results.filter(r => r.isRegistered).length,
      notRegistered: results.filter(r => !r.isRegistered && !r.error).length,
      errors: results.filter(r => r.error).length
    });

    return results;
  }

  /**
   * Get validation statistics
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      requestLogSize: this.requestLog.length,
      requestsThisMinute: this.requestLog.filter(
        log => Date.now() - new Date(log.timestamp).getTime() < 60000
      ).length
    };
  }

  /**
   * Clear cache
   */
  clearCache(email = null) {
    if (email) {
      this.cache.delete(email);
      this.log('info', 'Cleared cache for email', { email });
    } else {
      const size = this.cache.size;
      this.cache.clear();
      this.log('info', 'Cleared all cache', { clearedEntries: size });
    }
  }

  /**
   * Get request logs
   */
  getLogs(level = null) {
    if (level) {
      return this.requestLog.filter(log => log.level === level);
    }
    return this.requestLog;
  }
}

// Export
module.exports = AdvancedAmazonValidator;

// Example usage jika dijalankan directly
if (require.main === module) {
  async function example() {
    const validator = new AdvancedAmazonValidator({
      cacheDuration: 600000, // 10 minutes
      maxRetries: 3,
      retryDelay: 500,
      rateLimitPerMinute: 20,
      enableLogging: true
    });

    try {
      // Single validation
      console.log('\n=== Single Validation ===');
      const result = await validator.validate('test@gmail.com');
      console.log(result);

      // Batch validation
      console.log('\n=== Batch Validation ===');
      const batchResults = await validator.validateBatch([
        'user1@gmail.com',
        'user2@yahoo.com',
        'user3@hotmail.com'
      ], { delayMs: 1000 });

      console.log('\nBatch Results Summary:');
      batchResults.forEach(r => {
        console.log(`${r.email}: ${r.isRegistered ? '✓ Terdaftar' : '✗ Tidak Terdaftar'}`);
      });

      // Stats
      console.log('\n=== Statistics ===');
      console.log(validator.getStats());

    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  example();
}
