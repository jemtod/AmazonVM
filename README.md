# Amazon Email Validator Tool

Tools untuk mengecek apakah email terdaftar di Amazon atau tidak. Ini adalah **validator saja**, bukan login tool.

## 📋 Daftar Isi
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [API Reference](#api-reference)
- [Contoh Implementasi](#contoh-implementasi)
- [Catatan Penting](#catatan-penting)

## 🚀 Instalasi

### Prerequisites
- Node.js v12 atau lebih tinggi
- npm (sudah termasuk dengan Node.js)

### Setup
```bash
# Clone atau download file
cd d:\CODEX\AmazonVM

# Install dependencies (tidak ada yang khusus, menggunakan built-in modules)
# File sudah siap digunakan
```

## 💻 Penggunaan

### 1. Command Line (CLI)

```bash
# Single email validation
node amazonEmailValidator.js user@gmail.com

# Output contoh:
# === Amazon Email Validator ===
# Email: user@gmail.com
# Status: ✓ Terdaftar
# Pesan: Email terdaftar di Amazon
# HTTP Code: 200
```

### 2. Sebagai Module (Node.js Script)

```javascript
const { validateAmazonEmail, validateMultipleEmails } = require('./amazonEmailValidator');

// Cek single email
async function checkEmail() {
  try {
    const result = await validateAmazonEmail('user@gmail.com');
    
    if (result.isRegistered) {
      console.log('Email terdaftar di Amazon');
    } else {
      console.log('Email tidak terdaftar');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkEmail();
```

### 3. Batch Validation

```javascript
const { validateMultipleEmails } = require('./amazonEmailValidator');

async function checkMultipleEmails() {
  const emails = [
    'user1@gmail.com',
    'user2@yahoo.com',
    'user3@hotmail.com'
  ];
  
  try {
    const results = await validateMultipleEmails(emails);
    
    results.forEach(result => {
      console.log(`${result.email}: ${result.isRegistered ? 'Terdaftar' : 'Tidak Terdaftar'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

checkMultipleEmails();
```

## 📚 API Reference

### `validateAmazonEmail(email)`

Mengecek apakah email terdaftar di Amazon.

**Parameters:**
- `email` (string): Email address yang ingin dicek

**Returns:**
```javascript
Promise<{
  isRegistered: boolean,      // true jika email terdaftar
  message: string,            // Pesan deskriptif
  statusCode: number,         // HTTP status code (200, 404, 400, 500, 408)
  responseCode: number        // Response code dari Amazon (optional)
}>
```

**Status Codes:**
| Code | Makna |
|------|-------|
| 200 | Email terdaftar di Amazon |
| 400 | Format email tidak valid |
| 404 | Email tidak terdaftar |
| 408 | Request timeout |
| 500 | Error atau tidak dapat diverifikasi |

**Contoh:**
```javascript
const result = await validateAmazonEmail('test@gmail.com');

// Output:
// {
//   isRegistered: true,
//   message: 'Email terdaftar di Amazon',
//   statusCode: 200,
//   responseCode: 200
// }
```

### `validateMultipleEmails(emails)`

Mengecek multiple email secara batch.

**Parameters:**
- `emails` (array): Array berisi email addresses

**Returns:**
```javascript
Promise<Array<{
  email: string,
  isRegistered: boolean,
  message: string,
  statusCode: number
}>>
```

**Contoh:**
```javascript
const results = await validateMultipleEmails([
  'user1@gmail.com',
  'user2@yahoo.com'
]);

// Output:
// [
//   {
//     email: 'user1@gmail.com',
//     isRegistered: true,
//     message: 'Email terdaftar di Amazon',
//     statusCode: 200
//   },
//   {
//     email: 'user2@yahoo.com',
//     isRegistered: false,
//     message: 'Email tidak terdaftar di Amazon',
//     statusCode: 404
//   }
// ]
```

## 💡 Contoh Implementasi

### Express.js API Endpoint

```javascript
const express = require('express');
const { validateAmazonEmail } = require('./amazonEmailValidator');

const app = express();
app.use(express.json());

// POST endpoint untuk validator
app.post('/api/validate-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    const result = await validateAmazonEmail(email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});

// Usage:
// POST http://localhost:3000/api/validate-email
// Body: { "email": "user@gmail.com" }
```

### With Rate Limiting

```javascript
const { validateAmazonEmail, validateMultipleEmails } = require('./amazonEmailValidator');

class AmazonEmailValidator {
  constructor(maxRequestsPerMinute = 10) {
    this.maxRequests = maxRequestsPerMinute;
    this.requestTimestamps = [];
  }

  async checkRateLimit() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      time => now - time < 60000 // Last 60 seconds
    );

    if (this.requestTimestamps.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }

    this.requestTimestamps.push(now);
  }

  async validate(email) {
    await this.checkRateLimit();
    return validateAmazonEmail(email);
  }
}

// Usage
const validator = new AmazonEmailValidator(5); // Max 5 requests per minute

validator.validate('user@gmail.com')
  .then(result => console.log(result))
  .catch(error => console.error(error.message));
```

### Caching Results

```javascript
const { validateAmazonEmail } = require('./amazonEmailValidator');

class CachedAmazonValidator {
  constructor(cacheDurationMs = 3600000) { // 1 hour default
    this.cache = new Map();
    this.cacheDuration = cacheDurationMs;
  }

  async validate(email) {
    const cached = this.cache.get(email);
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('Returning cached result');
      return cached.result;
    }

    const result = await validateAmazonEmail(email);
    
    this.cache.set(email, {
      result,
      timestamp: Date.now()
    });

    return result;
  }

  clearCache(email) {
    if (email) {
      this.cache.delete(email);
    } else {
      this.cache.clear();
    }
  }
}

// Usage
const validator = new CachedAmazonValidator();
const result = await validator.validate('user@gmail.com');
```

## ⚠️ Catatan Penting

### 1. **Legalitas & ToS**
- Tool ini menggunakan metode yang sama seperti password reset Amazon
- Gunakan untuk keperluan legitimate saja
- Respeto terhadap Amazon Terms of Service
- Jangan gunakan untuk spam, phishing, atau kegiatan illegal

### 2. **Rate Limiting**
- Amazon mungkin akan rate limit requests jika terlalu banyak
- Gunakan delay antar requests (minimal 500ms-1000ms)
- Batch function sudah include automatic 1-second delay
- Implementasikan exponential backoff untuk production use

### 3. **Akurasi**
- Validator ini relies pada response patterns dari Amazon
- Hasil mungkin berubah jika Amazon mengubah response format
- Selalu handle error cases dengan graceful

### 4. **Privacy**
- Tidak menyimpan log atau historical data
- Tidak ada tracking terhadap email yang dicek
- All validation dilakukan locally

### 5. **Error Handling**
```javascript
try {
  const result = await validateAmazonEmail(email);
} catch (error) {
  // Handle:
  // - Network errors
  // - Timeout (408)
  // - Invalid email format (400)
  // - Server errors (500)
  console.error(error);
}
```

## 🔧 Troubleshooting

### Issue: "We cannot connect to Amazon"
```bash
# Solution: Check internet connection
# Pastikan network connectivity normal
```

### Issue: Rate limit errors
```javascript
// Solution: Tambah delay antar requests
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 detik
```

### Issue: Results tidak akurat
```javascript
// Solution: Clear cache jika pakai caching
validator.clearCache();
```

## 📝 License

Tools ini dibuat untuk educational purposes. Gunakan dengan bertanggung jawab.

---

**Last Updated:** January 2026
**Version:** 1.0.0
