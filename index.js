/**
 * Amazon Email Validator - Main Entry Point
 * Import semua modules dari sini
 */

// Core Validators
const {
  validateAmazonEmail,
  validateMultipleEmails
} = require('./amazonEmailValidator');

const AdvancedAmazonValidator = require('./advancedValidator');

// Integration Examples
const {
  createBasicExpressApp,
  AmazonEmailDatabase,
  EmailValidationWorker,
  createReactApiServer,
  EmailFormValidator,
  EmailValidationWebhook
} = require('./examples');

// Export everything
module.exports = {
  // Core Functions
  validateAmazonEmail,
  validateMultipleEmails,

  // Advanced Validator Class
  AdvancedAmazonValidator,

  // Integration Classes
  AmazonEmailDatabase,
  EmailValidationWorker,
  EmailFormValidator,
  EmailValidationWebhook,

  // Factory Functions
  createBasicExpressApp,
  createReactApiServer,

  // Version Info
  version: '1.0.0',
  description: 'Amazon Email Validator - Check if emails are registered on Amazon'
};

/**
 * QUICK START:
 * 
 * const {
 *   validateAmazonEmail,
 *   AdvancedAmazonValidator
 * } = require('./index');
 * 
 * // Method 1: Simple
 * const result = await validateAmazonEmail('user@gmail.com');
 * 
 * // Method 2: Advanced
 * const validator = new AdvancedAmazonValidator();
 * const result = await validator.validate('user@gmail.com');
 * 
 * // Method 3: Batch
 * const results = await validator.validateBatch([...emails...]);
 */
