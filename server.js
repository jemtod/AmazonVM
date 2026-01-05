/**
 * Amazon Email Validator - Express.js Server
 * REST API untuk email validation
 */

const express = require('express');
const cors = require('cors');
const AdvancedAmazonValidator = require('./advancedValidator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize validator dengan config
const validator = new AdvancedAmazonValidator({
  cacheDuration: 3600000, // 1 hour
  maxRetries: 3,
  retryDelay: 1000,
  rateLimitPerMinute: 60,
  enableLogging: true
});

// Routes

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Amazon Email Validator Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/validate
 * Validate single email
 * 
 * Body: { "email": "user@example.com" }
 * Response: { isRegistered, message, statusCode }
 */
app.post('/api/validate', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        statusCode: 400
      });
    }

    if (typeof email !== 'string') {
      return res.status(400).json({
        error: 'Email must be a string',
        statusCode: 400
      });
    }

    // Validate
    const result = await validator.validate(email);

    res.status(result.statusCode >= 400 ? 400 : 200).json(result);
  } catch (error) {
    res.status(429).json({
      error: error.message,
      statusCode: 429
    });
  }
});

/**
 * POST /api/validate-batch
 * Validate multiple emails
 * 
 * Body: {
 *   "emails": ["user1@example.com", "user2@example.com"],
 *   "delayMs": 1000,
 *   "stopOnError": false
 * }
 */
app.post('/api/validate-batch', async (req, res) => {
  try {
    const { emails, delayMs = 1000, stopOnError = false } = req.body;

    // Validation
    if (!emails) {
      return res.status(400).json({
        error: 'Emails array is required',
        statusCode: 400
      });
    }

    if (!Array.isArray(emails)) {
      return res.status(400).json({
        error: 'Emails must be an array',
        statusCode: 400
      });
    }

    if (emails.length === 0) {
      return res.status(400).json({
        error: 'Emails array cannot be empty',
        statusCode: 400
      });
    }

    if (emails.length > 1000) {
      return res.status(400).json({
        error: 'Maximum 1000 emails per batch',
        statusCode: 400
      });
    }

    // Validate batch
    const results = await validator.validateBatch(emails, {
      delayMs,
      stopOnError
    });

    // Summary
    const summary = {
      total: results.length,
      registered: results.filter(r => r.isRegistered).length,
      notRegistered: results.filter(r => !r.isRegistered && !r.error).length,
      errors: results.filter(r => r.error).length
    };

    res.json({
      summary,
      results
    });
  } catch (error) {
    res.status(429).json({
      error: error.message,
      statusCode: 429
    });
  }
});

/**
 * GET /api/stats
 * Get validator statistics
 */
app.get('/api/stats', (req, res) => {
  res.json({
    stats: validator.getStats(),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/logs
 * Get request logs (optional level filter)
 * Query: ?level=error|warn|info|debug
 */
app.get('/api/logs', (req, res) => {
  const { level } = req.query;
  const logs = validator.getLogs(level || null);

  res.json({
    total: logs.length,
    level: level || 'all',
    logs: logs.slice(-100) // Last 100 logs
  });
});

/**
 * POST /api/cache/clear
 * Clear cache
 * Body: { "email": "optional@example.com" }
 */
app.post('/api/cache/clear', (req, res) => {
  const { email } = req.body;

  try {
    validator.clearCache(email || null);
    res.json({
      message: email ? `Cache cleared for ${email}` : 'Cache cleared for all emails',
      stats: validator.getStats()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log('Amazon Email Validator Server');
  console.log(`${'='.repeat(50)}`);
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /health`);
  console.log(`  POST /api/validate`);
  console.log(`  POST /api/validate-batch`);
  console.log(`  GET  /api/stats`);
  console.log(`  GET  /api/logs`);
  console.log(`  POST /api/cache/clear`);
  console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;
