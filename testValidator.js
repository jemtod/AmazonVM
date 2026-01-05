const { validateAmazonEmail, validateMultipleEmails } = require('./amazonEmailValidator');

/**
 * Contoh penggunaan validator Amazon Email
 */

async function testValidator() {
  console.log('=== TEST AMAZON EMAIL VALIDATOR ===\n');

  // Test 1: Single email validation
  console.log('Test 1: Mengecek single email');
  console.log('--------------------------------');
  
  const testEmails = [
    'user@gmail.com',
    'john.doe@yahoo.com',
    'invalid-email-format',
    'test@amazon.com'
  ];

  for (const email of testEmails) {
    try {
      console.log(`\nMengecek: ${email}`);
      const result = await validateAmazonEmail(email);
      
      console.log(`  Terdaftar: ${result.isRegistered ? 'YA ✓' : 'TIDAK ✗'}`);
      console.log(`  Pesan: ${result.message}`);
      console.log(`  HTTP Status: ${result.statusCode}`);
      
      // Delay untuk menghindari rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }
  }

  // Test 2: Batch validation
  console.log('\n\nTest 2: Batch validation (multiple emails)');
  console.log('------------------------------------------');
  
  const batchEmails = [
    'user1@gmail.com',
    'user2@yahoo.com',
    'user3@hotmail.com'
  ];

  try {
    const results = await validateMultipleEmails(batchEmails);
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Batch validation error:', error);
  }
}

// Jalankan test
testValidator().catch(console.error);
