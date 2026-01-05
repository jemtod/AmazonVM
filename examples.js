/**
 * Integration Examples - Cara mengintegrasikan validator ke aplikasi Anda
 */

// ====================================================================
// EXAMPLE 1: Basic Integration dalam Express.js Middleware
// ====================================================================

const express = require('express');
const { validateAmazonEmail } = require('./amazonEmailValidator');

function createBasicExpressApp() {
  const app = express();

  // Middleware untuk validate Amazon email sebelum proses
  async function validateAmazonEmailMiddleware(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      // Check apakah email terdaftar di Amazon
      const result = await validateAmazonEmail(email);

      if (!result.isRegistered) {
        return res.status(400).json({
          error: 'Email tidak terdaftar di Amazon',
          details: result
        });
      }

      // Jika valid, lanjut ke handler berikutnya
      req.amazonEmail = result;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Route yang menggunakan middleware
  app.post('/register-amazon-user', validateAmazonEmailMiddleware, (req, res) => {
    // Handler ini hanya dijalankan jika email valid di Amazon
    res.json({
      message: 'User registration successful',
      email: req.body.email
    });
  });

  return app;
}


// ====================================================================
// EXAMPLE 2: Database Integration - Store & Verify Results
// ====================================================================

class AmazonEmailDatabase {
  constructor() {
    this.db = new Map(); // Simulasi database
  }

  /**
   * Check email dan store result ke database
   */
  async registerWithAmazonCheck(email, userData) {
    const { validateAmazonEmail } = require('./amazonEmailValidator');

    try {
      // Validate email di Amazon
      const validation = await validateAmazonEmail(email);

      if (!validation.isRegistered) {
        throw new Error('Email tidak terdaftar di Amazon');
      }

      // Store ke database
      const record = {
        id: Date.now(),
        email,
        userData,
        amazonVerified: true,
        verifiedAt: new Date().toISOString(),
        validationResult: {
          isRegistered: validation.isRegistered,
          statusCode: validation.statusCode,
          timestamp: new Date().toISOString()
        }
      };

      this.db.set(email, record);

      return {
        success: true,
        record
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get stored record
   */
  getRecord(email) {
    return this.db.get(email);
  }

  /**
   * Get all verified Amazon emails
   */
  getAllAmazonVerified() {
    return Array.from(this.db.values()).filter(r => r.amazonVerified);
  }
}


// ====================================================================
// EXAMPLE 3: Worker Process - Background Validation
// ====================================================================

class EmailValidationWorker {
  constructor(concurrency = 5) {
    this.queue = [];
    this.concurrency = concurrency;
    this.processing = 0;
    this.results = [];
  }

  /**
   * Add email ke queue untuk di-validate
   */
  async addToQueue(email, callback) {
    this.queue.push({ email, callback });
    this.processQueue();
  }

  /**
   * Process queue dengan concurrency control
   */
  async processQueue() {
    while (this.processing < this.concurrency && this.queue.length > 0) {
      this.processing++;
      const item = this.queue.shift();

      this.validateEmail(item.email)
        .then(result => {
          this.results.push({ email: item.email, ...result });
          if (item.callback) item.callback(null, result);
        })
        .catch(error => {
          if (item.callback) item.callback(error);
        })
        .finally(() => {
          this.processing--;
          this.processQueue();
        });
    }
  }

  /**
   * Validate single email
   */
  async validateEmail(email) {
    const { validateAmazonEmail } = require('./amazonEmailValidator');
    return validateAmazonEmail(email);
  }

  /**
   * Get results
   */
  getResults() {
    return this.results;
  }
}


// ====================================================================
// EXAMPLE 4: React/Frontend Integration (Node Backend)
// ====================================================================

function createReactApiServer() {
  const express = require('express');
  const cors = require('cors');
  const AdvancedAmazonValidator = require('./advancedValidator');

  const app = express();
  const validator = new AdvancedAmazonValidator();

  app.use(cors());
  app.use(express.json());

  /**
   * Endpoint untuk React frontend
   * POST /api/check-email
   * Body: { "email": "user@example.com" }
   */
  app.post('/api/check-email', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          valid: false,
          message: 'Email is required'
        });
      }

      const result = await validator.validate(email);

      res.json({
        valid: true,
        isRegistered: result.isRegistered,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        valid: false,
        message: error.message
      });
    }
  });

  return app;
}

/**
 * React component contoh untuk mengunakan API:
 * 
 * const [email, setEmail] = useState('');
 * const [result, setResult] = useState(null);
 * const [loading, setLoading] = useState(false);
 * 
 * const checkEmail = async () => {
 *   setLoading(true);
 *   const response = await fetch('http://localhost:3000/api/check-email', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email })
 *   });
 *   const data = await response.json();
 *   setResult(data);
 *   setLoading(false);
 * };
 * 
 * return (
 *   <div>
 *     <input value={email} onChange={e => setEmail(e.target.value)} />
 *     <button onClick={checkEmail} disabled={loading}>
 *       {loading ? 'Checking...' : 'Check Email'}
 *     </button>
 *     {result && (
 *       <p>{result.isRegistered ? 'Email ada di Amazon' : 'Email tidak ada'}</p>
 *     )}
 *   </div>
 * );
 */


// ====================================================================
// EXAMPLE 5: Email Form Validation
// ====================================================================

class EmailFormValidator {
  constructor() {
    this.errors = [];
  }

  /**
   * Validate email dengan multiple checks
   */
  async validateEmail(email) {
    this.errors = [];

    // 1. Check format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.errors.push('Format email tidak valid');
      return false;
    }

    // 2. Check length
    if (email.length > 254) {
      this.errors.push('Email terlalu panjang (max 254 karakter)');
      return false;
    }

    // 3. Check blacklist domains (optional)
    const blacklistDomains = ['tempmail.com', 'throwaway.email'];
    const domain = email.split('@')[1];
    if (blacklistDomains.includes(domain)) {
      this.errors.push('Domain email tidak diizinkan');
      return false;
    }

    // 4. Check if registered at Amazon
    try {
      const { validateAmazonEmail } = require('./amazonEmailValidator');
      const result = await validateAmazonEmail(email);

      if (!result.isRegistered) {
        this.errors.push('Email tidak terdaftar di Amazon');
        return false;
      }
    } catch (error) {
      this.errors.push('Tidak dapat memverifikasi email: ' + error.message);
      return false;
    }

    return true;
  }

  getErrors() {
    return this.errors;
  }
}


// ====================================================================
// EXAMPLE 6: Webhook Integration - Notify on Results
// ====================================================================

class EmailValidationWebhook {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Validate dan kirim result ke webhook
   */
  async validateAndNotify(email, userId) {
    const { validateAmazonEmail } = require('./amazonEmailValidator');

    try {
      const result = await validateAmazonEmail(email);

      // Send ke webhook
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          isRegistered: result.isRegistered,
          message: result.message,
          statusCode: result.statusCode,
          timestamp: new Date().toISOString()
        })
      });

      return result;
    } catch (error) {
      console.error('Webhook integration error:', error);
      throw error;
    }
  }
}


// ====================================================================
// EXPORT ALL EXAMPLES
// ====================================================================

module.exports = {
  createBasicExpressApp,
  AmazonEmailDatabase,
  EmailValidationWorker,
  createReactApiServer,
  EmailFormValidator,
  EmailValidationWebhook
};

/**
 * USAGE EXAMPLES:
 * 
 * // Example 1: Express Middleware
 * const app = createBasicExpressApp();
 * app.listen(3000);
 * 
 * // Example 2: Database Integration
 * const db = new AmazonEmailDatabase();
 * const result = await db.registerWithAmazonCheck('user@gmail.com', {
 *   name: 'John Doe',
 *   phone: '123456789'
 * });
 * 
 * // Example 3: Background Worker
 * const worker = new EmailValidationWorker(5); // 5 concurrent
 * await worker.addToQueue('email1@gmail.com', (err, result) => {
 *   console.log('Validated:', result);
 * });
 * 
 * // Example 4: React API
 * const reactApp = createReactApiServer();
 * reactApp.listen(3000);
 * 
 * // Example 5: Form Validation
 * const formValidator = new EmailFormValidator();
 * const isValid = await formValidator.validateEmail('user@gmail.com');
 * if (!isValid) {
 *   console.log('Errors:', formValidator.getErrors());
 * }
 * 
 * // Example 6: Webhook
 * const webhook = new EmailValidationWebhook('https://myapp.com/webhook');
 * await webhook.validateAndNotify('user@gmail.com', 'user123');
 */
