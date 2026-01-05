# 🎯 Amazon Email Validator - Complete Toolkit

**Validator tools untuk mengecek apakah email terdaftar di Amazon (bukan login, hanya validator email)**

## 📍 Start Here - Pilih Berdasarkan Kebutuhan Anda

### 🏃 **Butuh Mulai Cepat? (5 Menit)**
1. Baca: **[QUICKSTART.md](QUICKSTART.md)** (comprehensive quick guide)
2. Run: `node amazonEmailValidator.js test@gmail.com`
3. Done! ✅

### 👨‍💻 **Mau Pakai di Code (Node.js)?**
1. Baca: **[QUICKSTART.md](QUICKSTART.md)** → section "Node.js Module"
2. Copy code dari **[examples.js](examples.js)**
3. Import dari `index.js`:
   ```javascript
   const { validateAmazonEmail, AdvancedAmazonValidator } = require('./index');
   ```

### 🌐 **Mau Buat REST API?**
1. Run: `node server.js`
2. Baca: **[README.md](README.md)** → "Server Endpoints" section
3. Test dengan: `test-api.bat` atau curl commands

### 🎮 **Mau Interactive Testing?**
1. Run: `node demo.js` (interactive menu)
2. atau: `test-api.bat` (untuk testing API)

### 🔗 **Mau Integrate ke Project?**
1. Baca: **[examples.js](examples.js)** - Copy-paste ready code
2. Check: **[FILES_GUIDE.md](FILES_GUIDE.md)** - Find right module
3. Reference: **[README.md](README.md)** - Full documentation

### 📚 **Butuh Full Documentation?**
1. Baca: **[README.md](README.md)** - Complete reference
2. Check: **[FILES_GUIDE.md](FILES_GUIDE.md)** - File descriptions
3. Review: **[examples.js](examples.js)** - Practical examples

---

## 📦 What's Included?

### Core Modules (3 files)
| File | Purpose | Use When |
|------|---------|----------|
| **amazonEmailValidator.js** | Basic validator | Simple CLI checks |
| **advancedValidator.js** | Production-ready | Cache, retry, rate limiting |
| **index.js** | Main entry point | Importing modules |

### Tools & Utilities (3 files)
| File | Purpose | Use When |
|------|---------|----------|
| **server.js** | REST API Server | Want HTTP endpoints |
| **demo.js** | Interactive Demo | Want to test interactively |
| **examples.js** | Integration Examples | Want to integrate |

### Testing (2 files)
| File | Purpose |
|------|---------|
| **testValidator.js** | Test examples & references |
| **test-api.bat** | Interactive API testing |

### Documentation (5 files)
| File | Content |
|------|---------|
| **QUICKSTART.md** | 5-minute quick start (START HERE) |
| **README.md** | Full comprehensive documentation |
| **FILES_GUIDE.md** | Detailed file descriptions |
| **SETUP_CHECKLIST.md** | Installation verification |
| **SUMMARY.txt** | Overview & next steps |

### Configuration (1 file)
| File | Purpose |
|------|---------|
| **package.json** | Node.js package config |

---

## 🚀 3 Cara Penggunaan Utama

### **Method 1: Command Line (Paling Simple)**
```bash
node amazonEmailValidator.js user@gmail.com
# Output: Email registration status
```

### **Method 2: Node.js Module**
```javascript
const { validateAmazonEmail } = require('./index');
const result = await validateAmazonEmail('user@gmail.com');
```

### **Method 3: REST API**
```bash
node server.js
# POST http://localhost:3000/api/validate
```

---

## 📖 Documentation Structure

```
QUICKSTART.md (5-minute overview)
    ↓
README.md (comprehensive guide)
    ↓
FILES_GUIDE.md (understand structure)
    ↓
examples.js (implementation patterns)
    ↓
source code (details)
```

---

## 🎯 Common Tasks

### Validate single email
```bash
node amazonEmailValidator.js user@example.com
```

### Use in Node.js
```javascript
const { validateAmazonEmail } = require('./index');
await validateAmazonEmail('email@example.com');
```

### Batch validate
```javascript
const { AdvancedAmazonValidator } = require('./index');
const validator = new AdvancedAmazonValidator();
const results = await validator.validateBatch([...emails]);
```

### Run API server
```bash
node server.js  # Runs on http://localhost:3000
```

### Interactive testing
```bash
node demo.js    # Interactive menu
# or
test-api.bat    # API endpoint testing
```

---

## ✨ Features

✅ **Check if email is registered on Amazon**  
✅ **Single email validation**  
✅ **Batch validation with delay control**  
✅ **Caching for performance**  
✅ **Retry logic with exponential backoff**  
✅ **Rate limiting (customizable)**  
✅ **Request logging & statistics**  
✅ **REST API server**  
✅ **Interactive CLI**  
✅ **Zero external dependencies** (for core)  

---

## 🔍 Response Format

```javascript
{
  isRegistered: boolean,    // true = email ada di Amazon
  message: string,          // Description
  statusCode: number,       // 200, 400, 404, 500, etc
  responseCode: number      // Optional raw response
}
```

---

## ⚙️ Configuration Examples

### Basic (Simple)
```bash
node amazonEmailValidator.js test@gmail.com
```

### Advanced (With Features)
```javascript
const { AdvancedAmazonValidator } = require('./index');
const validator = new AdvancedAmazonValidator({
  cacheDuration: 3600000,      // 1 hour
  maxRetries: 3,
  retryDelay: 1000,
  rateLimitPerMinute: 30,
  enableLogging: true
});
```

### Production (API)
```bash
npm install express cors
node server.js
```

---

## 🚨 Important Notes

⚠️ **Validator Only** - Tidak bisa login, hanya check email existence  
⚠️ **Respect ToS** - Gunakan sesuai Amazon Terms of Service  
⚠️ **Rate Limiting** - Implement delay antar requests (min 500ms)  
⚠️ **Accuracy** - Depends on Amazon response patterns  

---

## 📚 Learning Path

**Beginner:**
1. Read QUICKSTART.md
2. Run `node demo.js`
3. Run `node amazonEmailValidator.js test@gmail.com`

**Intermediate:**
1. Read README.md
2. Study examples.js
3. Try advancedValidator.js

**Advanced:**
1. Read server.js
2. Integrate ke project Anda
3. Deploy & monitor

---

## 🗂️ Navigation Guide

| Need | File | Time |
|------|------|------|
| Quick overview | **SUMMARY.txt** | 2 min |
| Get started | **QUICKSTART.md** | 5 min |
| Full details | **README.md** | 20 min |
| File info | **FILES_GUIDE.md** | 10 min |
| Setup verify | **SETUP_CHECKLIST.md** | 5 min |
| Integration | **examples.js** | 15 min |
| Code exploration | Source files | varies |

---

## 💡 Pro Tips

1. **Start with CLI** - Try basic validator first
2. **Use Advanced for production** - Better error handling
3. **Implement caching** - Reduces API calls significantly
4. **Monitor rate limits** - Check stats regularly
5. **Batch process carefully** - Use appropriate delays

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Check you're in the right directory |
| "Module not found" | Ensure all files are downloaded |
| Network error | Check internet connection |
| Rate limit | Wait 1 minute or adjust settings |
| Results wrong | Clear cache: `validator.clearCache()` |

See **SETUP_CHECKLIST.md** untuk detailed troubleshooting.

---

## 🎓 Development

### Choose Your Learning Method

**Visual Learner?**
- Run `node demo.js` (interactive)

**Code Learner?**
- Study **examples.js**

**Documentation Learner?**
- Read **README.md**

**Hands-on Learner?**
- Modify & run testValidator.js

---

## 📞 Need Help?

1. **Quick answer** → Read **QUICKSTART.md**
2. **Detailed info** → Read **README.md**
3. **File questions** → Read **FILES_GUIDE.md**
4. **Integration** → Read **examples.js**
5. **Setup issues** → Read **SETUP_CHECKLIST.md**

---

## 🎉 Ready?

### Your Next Steps:

1. **Right Now:** Open **QUICKSTART.md**
2. **In 5 min:** Run `node amazonEmailValidator.js test@gmail.com`
3. **In 10 min:** Read **FILES_GUIDE.md**
4. **In 20 min:** Check **examples.js** for your use case
5. **Next:** Integrate into your project

---

## 📊 File Statistics

- **Total Files:** 14
- **Core Modules:** 3
- **Documentation:** 5
- **Tools & Examples:** 4
- **Config:** 2
- **Lines of Code:** ~2000+
- **Status:** ✅ Production Ready

---

**Version:** 1.0.0  
**Created:** January 2026  
**Maintained:** Active  

🚀 **Let's get started!**

**→ Go to [QUICKSTART.md](QUICKSTART.md) now →**

---

*Amazon Email Validator - Check email registration status without logging in*
