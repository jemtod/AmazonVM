const https = require('https');

/**
 * Amazon Email Validator
 * Mengecek apakah email terdaftar di Amazon
 * 
 * @param {string} email - Email yang ingin dicek
 * @returns {Promise<{isRegistered: boolean, message: string}>}
 */
async function validateAmazonEmail(email) {
  return new Promise((resolve, reject) => {
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resolve({
        isRegistered: false,
        message: 'Format email tidak valid',
        statusCode: 400
      });
    }

    const postData = new URLSearchParams();
    postData.append('email', email);
    postData.append('action', 'validate-email');

    const options = {
      hostname: 'www.amazon.com',
      path: '/ap/signin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://www.amazon.com/ap/signin',
        'Content-Length': Buffer.byteLength(postData.toString())
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Check untuk pesan error yang mengindikasikan email tidak ditemukan
          const notFoundPatterns = [
            /We can't find an account with that email/i,
            /We cannot find an account with that email/i,
            /no account found/i,
            /tidak ada akun/i
          ];

          const foundPatterns = [
            /We found an account/i,
            /Password/i,
            /account found/i,
            /akun ditemukan/i
          ];

          const isNotFound = notFoundPatterns.some(pattern => pattern.test(data));
          const isFound = foundPatterns.some(pattern => pattern.test(data));

          if (isNotFound) {
            return resolve({
              isRegistered: false,
              message: 'Email tidak terdaftar di Amazon',
              statusCode: 404,
              responseCode: res.statusCode
            });
          }

          if (isFound || res.statusCode === 200) {
            return resolve({
              isRegistered: true,
              message: 'Email terdaftar di Amazon',
              statusCode: 200,
              responseCode: res.statusCode
            });
          }

          // Default untuk kasus lain
          resolve({
            isRegistered: false,
            message: 'Tidak dapat memverifikasi email (silahkan coba lagi)',
            statusCode: 500,
            responseCode: res.statusCode,
            rawStatusCode: res.statusCode
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject({
        isRegistered: false,
        message: `Error: ${error.message}`,
        statusCode: 500
      });
    });

    // Timeout 10 detik
    req.setTimeout(10000, () => {
      req.destroy();
      reject({
        isRegistered: false,
        message: 'Request timeout',
        statusCode: 408
      });
    });

    req.write(postData.toString());
    req.end();
  });
}

/**
 * Batch validator untuk mengecek multiple email
 */
async function validateMultipleEmails(emails) {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await validateAmazonEmail(email);
      results.push({ email, ...result });
      // Delay antar request untuk menghindari rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        email,
        isRegistered: false,
        message: error.message || 'Error',
        statusCode: error.statusCode || 500
      });
    }
  }
  
  return results;
}

// Export untuk digunakan sebagai module
module.exports = {
  validateAmazonEmail,
  validateMultipleEmails
};

// Jika dijalankan langsung dari command line
if (require.main === module) {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: node amazonEmailValidator.js <email>');
    console.log('Example: node amazonEmailValidator.js user@example.com');
    process.exit(1);
  }

  validateAmazonEmail(email)
    .then(result => {
      console.log('\n=== Amazon Email Validator ===');
      console.log(`Email: ${email}`);
      console.log(`Status: ${result.isRegistered ? '✓ Terdaftar' : '✗ Tidak Terdaftar'}`);
      console.log(`Pesan: ${result.message}`);
      console.log(`HTTP Code: ${result.statusCode}`);
      process.exit(result.isRegistered ? 0 : 1);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
