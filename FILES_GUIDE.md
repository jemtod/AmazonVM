# 📚 Complete File Guide - Amazon Email Validator

## 📦 File Structure & Descriptions

```
d:\CODEX\AmazonVM\
│
├── 📄 CORE MODULES
│   ├── index.js
│   │   └─ Main entry point (import semuanya dari sini)
│   │
│   ├── amazonEmailValidator.js
│   │   ├─ validateAmazonEmail(email) - Check single email
│   │   └─ validateMultipleEmails(emails) - Check multiple emails
│   │   └─ Gunakan langsung dari CLI atau sebagai module
│   │
│   └── advancedValidator.js
│       ├─ AdvancedAmazonValidator class
│       ├─ Features: caching, retry, rate limiting, logging
│       ├─ Methods:
│       │  ├─ validate(email)
│       │  ├─ validateBatch(emails, options)
│       │  ├─ getStats()
│       │  ├─ getLogs(level)
│       │  └─ clearCache(email)
│       └─ Production-ready
│
├── 🌐 SERVER & API
│   └── server.js
│       ├─ Express.js REST API Server
│       ├─ Endpoints:
│       │  ├─ GET  /health
│       │  ├─ POST /api/validate
│       │  ├─ POST /api/validate-batch
│       │  ├─ GET  /api/stats
│       │  ├─ GET  /api/logs
│       │  └─ POST /api/cache/clear
│       └─ Run: node server.js
│
├── 🧪 TESTING & EXAMPLES
│   ├── demo.js
│   │   ├─ Interactive CLI demo
│   │   ├─ Menu-driven interface
│   │   ├─ Test semua features interaktif
│   │   └─ Run: node demo.js
│   │
│   ├── testValidator.js
│   │   ├─ Test examples untuk basic usage
│   │   ├─ Contoh single & batch validation
│   │   └─ Run: node testValidator.js
│   │
│   ├── examples.js
│   │   ├─ Integration examples:
│   │   │  ├─ Express middleware
│   │   │  ├─ Database integration
│   │   │  ├─ Background worker
│   │   │  ├─ React API server
│   │   │  ├─ Form validation
│   │   │  └─ Webhook integration
│   │   └─ Copy-paste ready code
│   │
│   └── test-api.bat
│       ├─ Interactive batch file untuk test API endpoints
│       ├─ Menu-driven testing
│       └─ Run: test-api.bat
│
└── 📖 DOCUMENTATION
    ├── QUICKSTART.md
    │   ├─ 5-menit quick start guide
    │   ├─ Common use cases
    │   ├─ Configuration options
    │   └─ Troubleshooting
    │
    ├── README.md
    │   ├─ Full documentation
    │   ├─ API reference
    │   ├─ Installation & setup
    │   ├─ Advanced implementations
    │   ├─ Examples & snippets
    │   └─ Legal notes
    │
    ├── SUMMARY.txt
    │   ├─ Overview semua files
    │   ├─ 3 cara penggunaan utama
    │   └─ Next steps
    │
    └── FILES_GUIDE.md (file ini)
        └─ Detailed description setiap file
```

---

## 🎯 Kapan Menggunakan File Mana?

### 1️⃣ **Untuk Mulai Cepat (5 Menit)**
- Baca: **QUICKSTART.md**
- Jalankan: `node amazonEmailValidator.js test@gmail.com`

### 2️⃣ **Untuk Development (Node.js Script)**
```javascript
const { validateAmazonEmail } = require('./amazonEmailValidator');
// atau
const { AdvancedAmazonValidator } = require('./index');
```

### 3️⃣ **Untuk REST API**
```bash
node server.js
# Server berjalan di http://localhost:3000
```

### 4️⃣ **Untuk Interactive Testing**
```bash
node demo.js
# atau
test-api.bat
```

### 5️⃣ **Untuk Integration Contoh**
Buka file: **examples.js**
- Pilih contoh yang sesuai
- Copy code & adapt ke aplikasi Anda

### 6️⃣ **Untuk Full Documentation**
Baca: **README.md**

---

## 📊 File Comparison Table

| File | Purpose | Usage | Level |
|------|---------|-------|-------|
| **amazonEmailValidator.js** | Core validator | Direct use or module import | Beginner |
| **advancedValidator.js** | Advanced features | Module import untuk production | Intermediate |
| **server.js** | REST API server | Run & use via HTTP | Intermediate |
| **demo.js** | Interactive testing | Run as CLI | Beginner |
| **testValidator.js** | Test examples | Reference code | Beginner |
| **examples.js** | Integration examples | Copy & adapt | Intermediate |
| **index.js** | Main entry point | Import all modules | Any |
| **QUICKSTART.md** | Quick reference | Read first | Any |
| **README.md** | Complete guide | Read for details | Any |

---

## 🚀 Common Tasks & Files

### Task: Validate email dari command line
```bash
# File: amazonEmailValidator.js
node amazonEmailValidator.js user@gmail.com
```

### Task: Validate dalam Node.js script
```javascript
// File: amazonEmailValidator.js atau index.js
const { validateAmazonEmail } = require('./amazonEmailValidator');
const result = await validateAmazonEmail('email@example.com');
```

### Task: Gunakan dengan cache & retry
```javascript
// File: advancedValidator.js atau index.js
const { AdvancedAmazonValidator } = require('./advancedValidator');
const validator = new AdvancedAmazonValidator();
const result = await validator.validate('email@example.com');
```

### Task: Batch validate banyak email
```javascript
// File: advancedValidator.js atau index.js
const results = await validator.validateBatch([...emails...]);
```

### Task: Jalankan REST API
```bash
# File: server.js
node server.js
# Akses: http://localhost:3000/api/validate
```

### Task: Test API endpoints
```bash
# File: test-api.bat atau dapat pakai curl
test-api.bat
```

### Task: Interactive demo
```bash
# File: demo.js
node demo.js
```

### Task: Integration ke Express
```javascript
// File: examples.js
const { createBasicExpressApp } = require('./examples');
const app = createBasicExpressApp();
app.listen(3000);
```

---

## 📋 What Each File Exports

### **amazonEmailValidator.js**
```javascript
module.exports = {
  validateAmazonEmail(email) → Promise,
  validateMultipleEmails(emails) → Promise
}
```

### **advancedValidator.js**
```javascript
module.exports = AdvancedAmazonValidator (class)
// dengan methods: validate, validateBatch, getStats, getLogs, clearCache
```

### **index.js** (Recommended for imports)
```javascript
module.exports = {
  validateAmazonEmail,
  validateMultipleEmails,
  AdvancedAmazonValidator,
  AmazonEmailDatabase,
  EmailValidationWorker,
  EmailFormValidator,
  EmailValidationWebhook,
  createBasicExpressApp,
  createReactApiServer,
  version,
  description
}
```

### **examples.js**
```javascript
module.exports = {
  createBasicExpressApp(),
  AmazonEmailDatabase (class),
  EmailValidationWorker (class),
  createReactApiServer(),
  EmailFormValidator (class),
  EmailValidationWebhook (class)
}
```

---

## 🔧 Installation & Setup

### Semua files sudah siap digunakan!

```bash
# 1. Tidak ada dependency eksternal untuk core
cd d:\CODEX\AmazonVM

# 2. Untuk server (optional)
npm install express cors

# 3. Mulai gunakan
node amazonEmailValidator.js test@gmail.com
```

---

## 💡 Best Practices

1. **Untuk Production**: Gunakan **advancedValidator.js** (dengan cache & retry)
2. **Untuk Quick Test**: Gunakan **amazonEmailValidator.js**
3. **Untuk API**: Jalankan **server.js**
4. **Untuk Learning**: Baca **README.md** dan jalankan **demo.js**
5. **Untuk Integration**: Copy code dari **examples.js**

---

## 🐛 Troubleshooting

| Issue | File to Check | Solution |
|-------|---------------|----------|
| Module not found | index.js | Pastikan di direktori yang benar |
| CORS error | server.js | Enable CORS di line 13 |
| Rate limit | advancedValidator.js | Adjust rateLimitPerMinute option |
| Cache issues | advancedValidator.js | Call clearCache() |
| API not responding | server.js | Check port 3000 tersedia |

---

## 📞 File Relationships

```
index.js (main entry)
├─ amazonEmailValidator.js (core)
├─ advancedValidator.js (wrapper)
├─ server.js (API server)
├─ examples.js (integrations)
├─ demo.js (interactive)
└─ testValidator.js (examples)
```

---

## 🎓 Learning Path

1. **Beginner**: QUICKSTART.md → demo.js → testValidator.js
2. **Intermediate**: README.md → examples.js → advancedValidator.js
3. **Advanced**: server.js → integrations → production deployment

---

**Last Updated**: January 2026  
**Total Files**: 11 (3 core + 3 test + 3 docs + 1 server + 1 main)  
**Status**: ✅ Production Ready

Happy coding! 🚀
