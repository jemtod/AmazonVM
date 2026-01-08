# Amazon Email Validator

Validator untuk mengecek apakah email terdaftar di Amazon atau tidak.

## Instalasi

```bash
cd d:\CODEX\AmazonVM
npm install  # install dependencies
```

## Penggunaan

### CLI Interactive (Baru!)
```bash
node cli.js           # menu interaktif
npm run cli           # sama dengan di atas
```

### CLI Quick Commands
```bash
# Single email
node cli.js --email user@gmail.com

# Batch dari list
node cli.js --list "email1@test.com,email2@test.com" --delay 1200

# Batch dari file
node cli.js --file emails.txt --delay 1000

# Dengan proxy
node cli.js --email user@gmail.com --proxy 192.168.1.1:8080
node cli.js --file emails.csv --proxy ip:port:user:pass

# Lihat semua opsi
node cli.js --help
```

### Web GUI
```bash
# Start server
npm start
# atau: node server.js

# Buka browser: http://localhost:8080
# Buka file: gui.html
```

### REST API
```bash
npm start   # runs on port 8080

# Test endpoints
curl -X POST http://localhost:8080/api/validate -H "Content-Type: application/json" -d '{"email":"user@gmail.com"}'
```

## File Structure

```
d:\CODEX\AmazonVM\
├── cli.js                      # CLI interactive + quick commands
├── gui.html                    # Web GUI (standalone/with server)
├── server.js                   # REST API server untuk GUI
├── amazonEmailValidator.js     # Core validator
├── advancedValidator.js        # Advanced dengan cache/retry/proxy
├── index.js                    # Module entry point
├── package.json                # Dependencies
└── README.md                   # Dokumentasi ini
```

## Fitur CLI

✅ **Interactive Menu** - Pilih mode dari menu  
✅ **Single Email** - Validasi satu email dengan opsi proxy  
✅ **Batch Paste** - Input multiple emails langsung dari terminal  
✅ **File Support** - Load dari .txt atau .csv  
✅ **Proxy Support** - Format: `ip:port` atau `ip:port:user:pass`  
✅ **Email Normalization** - Otomatis clean `email:password` format  
✅ **Stats & Cache** - View statistik dan clear cache  
✅ **Table Output** - Hasil dalam format tabel yang rapi  

## Fitur GUI

✅ **Single Email Validation** - Dengan proxy support  
✅ **Batch Manual** - Paste multiple emails  
✅ **File Upload** - Upload .txt atau .csv  
✅ **Proxy Settings** - Konfigurasi persistent dengan rotation  
✅ **Statistics** - Real-time stats dan logs  
✅ **Modern UI** - Responsive dan user-friendly  

## API Endpoints

**GET** `/health` - Server health check  
**POST** `/api/validate` - Single email validation  
**POST** `/api/validate-batch` - Batch validation  
**GET** `/api/stats` - Validator statistics  
**POST** `/api/cache/clear` - Clear cache  

## Dalam Script Node.js

```javascript
const { validateAmazonEmail } = require('./amazonEmailValidator');

const result = await validateAmazonEmail('user@gmail.com');
console.log(result.isRegistered ? 'Terdaftar' : 'Tidak Terdaftar');
```

### Advanced dengan Proxy
```javascript
const AdvancedAmazonValidator = require('./advancedValidator');

const validator = new AdvancedAmazonValidator();
const result = await validator.validate('user@gmail.com', {
  proxy: '192.168.1.1:8080:user:pass'
});
```

## Penting

**⚠️ Disclaimer:**
- Tools untuk validation saja, bukan login
- Gunakan sesuai Amazon Terms of Service
- Terapkan rate limiting (delay 1000ms antar request)
- Jangan gunakan untuk spam atau phishing

**Status Codes:**
- `200`: Email terdaftar
- `404`: Email tidak terdaftar
- `400`: Format email tidak valid
- `408`: Request timeout
- `500`: Error server

---

**Version:** 2.0.0  
**License:** MIT  
**Author:** jemtod
