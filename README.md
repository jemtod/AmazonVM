# Amazon Email Validator

Validator untuk mengecek apakah email terdaftar di Amazon atau tidak.

## Instalasi

```bash
cd d:\CODEX\AmazonVM
# Tidak perlu install dependencies - sudah siap pakai
```

## Penggunaan Cepat

### CLI
```bash
node amazonEmailValidator.js user@gmail.com
```

### Dalam Script
```javascript
const { validateAmazonEmail } = require('./amazonEmailValidator');

const result = await validateAmazonEmail('user@gmail.com');
console.log(result.isRegistered ? 'Terdaftar' : 'Tidak Terdaftar');
```

### Batch
```javascript
const { validateMultipleEmails } = require('./amazonEmailValidator');

const results = await validateMultipleEmails([
  'user1@gmail.com',
  'user2@yahoo.com'
]);
```

## API

### `validateAmazonEmail(email)`
Cek satu email - returns: `{ isRegistered: boolean, message: string, statusCode: number }`

### `validateMultipleEmails(emails)`
Cek batch email - returns: array hasil validasi

## Penting

**⚠️ Disclaimer:**
- Tools untuk validation saja, bukan login
- Gunakan sesuai Amazon Terms of Service
- Terapkan rate limiting (delay 500-1000ms antar request)
- Jangan gunakan untuk spam atau phishing

**Status Codes:**
- `200`: Email terdaftar
- `404`: Email tidak terdaftar
- `400`: Format email tidak valid
- `408`: Request timeout
- `500`: Error server

---

**Version:** 1.0.0 | **License:** Educational purposes
