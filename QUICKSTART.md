# Quick Start Guide - Amazon Email Validator

## 🚀 Memulai dalam 5 Menit

### 1. **Command Line Usage (Paling Sederhana)**

```bash
# Check single email
node amazonEmailValidator.js user@gmail.com

# Output:
# === Amazon Email Validator ===
# Email: user@gmail.com
# Status: ✓ Terdaftar
# Pesan: Email terdaftar di Amazon
# HTTP Code: 200
```

### 2. **Sebagai Node.js Module**

```javascript
// app.js
const { validateAmazonEmail } = require('./amazonEmailValidator');

async function main() {
  try {
    const result = await validateAmazonEmail('user@gmail.com');
    console.log('Email registered:', result.isRegistered);
    console.log('Message:', result.message);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

Run dengan:
```bash
node app.js
```

### 3. **Dengan Advanced Features (Production)**

```javascript
// app.js
const AdvancedAmazonValidator = require('./advancedValidator');

async function main() {
  // Initialize dengan options
  const validator = new AdvancedAmazonValidator({
    cacheDuration: 3600000,      // Cache 1 hour
    maxRetries: 3,               // Retry 3x jika error
    rateLimitPerMinute: 30,      // Max 30 requests/minute
    enableLogging: true
  });

  // Single validation
  const result = await validator.validate('user@gmail.com');
  console.log(result);

  // Batch validation
  const results = await validator.validateBatch([
    'user1@gmail.com',
    'user2@yahoo.com',
    'user3@hotmail.com'
  ]);
  console.log(results);
}

main();
```

### 4. **REST API Server**

**Start server:**
```bash
node server.js
# Output: Server running on http://localhost:3000
```

**Test endpoint (dari PowerShell/CMD):**

```powershell
# Single validation
curl -X POST http://localhost:3000/api/validate `
  -ContentType "application/json" `
  -Body '{"email":"user@gmail.com"}'

# Batch validation
curl -X POST http://localhost:3000/api/validate-batch `
  -ContentType "application/json" `
  -Body '{"emails":["user1@gmail.com","user2@yahoo.com"]}'

# Get stats
curl -X GET http://localhost:3000/api/stats

# Check health
curl -X GET http://localhost:3000/health
```

## 📚 File Structure

```
d:\CODEX\AmazonVM\
├── amazonEmailValidator.js    # Core validator
├── advancedValidator.js        # Advanced version dengan cache/retry/logging
├── server.js                   # Express.js REST API server
├── testValidator.js            # Test examples
├── test-api.bat               # API testing script (interactive)
├── QUICKSTART.md              # File ini
└── README.md                  # Full documentation
```

## 🎯 Common Use Cases

### Use Case 1: Simple CLI Tool
```bash
node amazonEmailValidator.js test@gmail.com
```

### Use Case 2: Node.js Script
```javascript
const { validateAmazonEmail } = require('./amazonEmailValidator');
// ... use in your script
```

### Use Case 3: Web API with Caching
```bash
node server.js
# POST http://localhost:3000/api/validate
```

### Use Case 4: Batch Processing
```javascript
const AdvancedAmazonValidator = require('./advancedValidator');
const validator = new AdvancedAmazonValidator();

const emails = [...1000 emails...];
const results = await validator.validateBatch(emails);
```

## 🔍 Response Examples

### Success Response
```json
{
  "isRegistered": true,
  "message": "Email terdaftar di Amazon",
  "statusCode": 200
}
```

### Not Found Response
```json
{
  "isRegistered": false,
  "message": "Email tidak terdaftar di Amazon",
  "statusCode": 404
}
```

### Error Response
```json
{
  "isRegistered": false,
  "message": "Format email tidak valid",
  "statusCode": 400
}
```

## ⚙️ Configuration Options

Untuk Advanced Validator:

```javascript
const validator = new AdvancedAmazonValidator({
  // Cache duration dalam milliseconds (default: 1 hour)
  cacheDuration: 3600000,
  
  // Max retry attempts (default: 3)
  maxRetries: 3,
  
  // Delay antara retries dalam ms (default: 1000)
  retryDelay: 1000,
  
  // Max requests per minute (default: 30)
  rateLimitPerMinute: 30,
  
  // Enable console logging (default: true)
  enableLogging: true
});
```

## 📊 Monitoring & Logging

```javascript
// Get statistics
console.log(validator.getStats());
// Output:
// {
//   cacheSize: 5,
//   requestLogSize: 42,
//   requestsThisMinute: 2
// }

// Get logs by level
const errors = validator.getLogs('error');
const warnings = validator.getLogs('warn');
const all = validator.getLogs();
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run: `node -v` (ensure Node.js installed) |
| "Email format invalid" | Check email format is correct |
| "Rate limit exceeded" | Wait 1 minute or reduce request frequency |
| "Request timeout" | Check internet connection |
| "Results not accurate" | Clear cache: `validator.clearCache()` |

## 🔑 Key Methods

### Core Validator
- `validateAmazonEmail(email)` - Check single email
- `validateMultipleEmails(emails)` - Check multiple emails

### Advanced Validator
- `validate(email)` - With caching & retry
- `validateBatch(emails, options)` - Batch with rate limiting
- `getStats()` - Get statistics
- `getLogs(level)` - Get request logs
- `clearCache(email)` - Clear cache

### Server Endpoints
- `GET /health` - Server health check
- `POST /api/validate` - Single validation
- `POST /api/validate-batch` - Batch validation
- `GET /api/stats` - Statistics
- `GET /api/logs` - Request logs
- `POST /api/cache/clear` - Clear cache

## 💡 Tips

1. **Untuk production**, gunakan `AdvancedAmazonValidator` untuk cache & retry handling
2. **Untuk batch processing**, set `delayMs` minimal 500ms
3. **Monitoring**, check logs regularly untuk detect issues
4. **Rate limiting**, respect Amazon's limits (aim for max 1 request/second)
5. **Caching**, enable untuk reduce API calls dan improve performance

## 📞 Need Help?

Lihat [README.md](README.md) untuk dokumentasi lengkap dan contoh advanced.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
