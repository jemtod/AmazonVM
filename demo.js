#!/usr/bin/env node

/**
 * Amazon Email Validator - Interactive Demo
 * Demonstrasi semua features dengan interactive menu
 */

const readline = require('readline');
const { validateAmazonEmail, validateMultipleEmails } = require('./amazonEmailValidator');
const AdvancedAmazonValidator = require('./advancedValidator');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

class InteractiveDemo {
  constructor() {
    this.validator = new AdvancedAmazonValidator({
      enableLogging: true
    });
  }

  async showMainMenu() {
    console.clear();
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  Amazon Email Validator - Interactive Demo   ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('Pilih mode yang ingin digunakan:\n');
    console.log('  1. Simple Validator (CLI)');
    console.log('  2. Advanced Validator (dengan cache & retry)');
    console.log('  3. Batch Validator (multiple emails)');
    console.log('  4. View Statistics & Logs');
    console.log('  5. Exit\n');

    const choice = await question('Masukkan pilihan (1-5): ');
    return choice;
  }

  async runSimpleValidator() {
    console.clear();
    console.log('\n═══ SIMPLE VALIDATOR ═══\n');

    const email = await question('Masukkan email untuk dicek: ');

    if (!email.trim()) {
      console.log('\n❌ Email tidak boleh kosong!');
      await this.pressEnter();
      return;
    }

    try {
      console.log('\n⏳ Mengecek email...\n');
      const result = await validateAmazonEmail(email);

      console.log('═══════════════════════════════════════');
      console.log('HASIL VALIDASI:');
      console.log('═══════════════════════════════════════');
      console.log(`Email:      ${email}`);
      console.log(`Status:     ${result.isRegistered ? '✓ TERDAFTAR' : '✗ TIDAK TERDAFTAR'}`);
      console.log(`Pesan:      ${result.message}`);
      console.log(`HTTP Code:  ${result.statusCode}`);
      console.log('═══════════════════════════════════════\n');

    } catch (error) {
      console.log(`\n❌ Error: ${error.message}\n`);
    }

    await this.pressEnter();
  }

  async runAdvancedValidator() {
    console.clear();
    console.log('\n═══ ADVANCED VALIDATOR (dengan cache & retry) ═══\n');

    const email = await question('Masukkan email untuk dicek: ');

    if (!email.trim()) {
      console.log('\n❌ Email tidak boleh kosong!');
      await this.pressEnter();
      return;
    }

    try {
      console.log('\n⏳ Mengecek email dengan advanced features...\n');
      const result = await this.validator.validate(email);

      console.log('═══════════════════════════════════════');
      console.log('HASIL VALIDASI (ADVANCED):');
      console.log('═══════════════════════════════════════');
      console.log(`Email:        ${email}`);
      console.log(`Status:       ${result.isRegistered ? '✓ TERDAFTAR' : '✗ TIDAK TERDAFTAR'}`);
      console.log(`Pesan:        ${result.message}`);
      console.log(`HTTP Code:    ${result.statusCode}`);
      console.log(`Cache Hit:    ${result.responseCode === result.statusCode ? 'No' : 'Yes'}`);
      console.log('═══════════════════════════════════════\n');

    } catch (error) {
      console.log(`\n❌ Error: ${error.message}\n`);
    }

    await this.pressEnter();
  }

  async runBatchValidator() {
    console.clear();
    console.log('\n═══ BATCH VALIDATOR ═══\n');

    console.log('Format: Masukkan email satu per satu, enter tanpa input untuk selesai.\n');

    const emails = [];
    let emailCount = 1;

    while (true) {
      const email = await question(`Email ${emailCount}: `);
      if (!email.trim()) break;
      emails.push(email.trim());
      emailCount++;
    }

    if (emails.length === 0) {
      console.log('\n❌ Tidak ada email yang dimasukkan!');
      await this.pressEnter();
      return;
    }

    console.log(`\n⏳ Mengecek ${emails.length} email...\n`);

    try {
      const results = await this.validator.validateBatch(emails, {
        delayMs: 1000
      });

      console.log('═══════════════════════════════════════════════');
      console.log('HASIL BATCH VALIDATION:');
      console.log('═══════════════════════════════════════════════\n');

      let registeredCount = 0;
      let notRegisteredCount = 0;

      results.forEach((result, index) => {
        const status = result.isRegistered ? '✓' : '✗';
        const statusText = result.isRegistered ? 'TERDAFTAR' : 'TIDAK TERDAFTAR';
        
        if (result.isRegistered) registeredCount++;
        if (!result.isRegistered && !result.error) notRegisteredCount++;

        console.log(`${index + 1}. ${result.email}`);
        console.log(`   Status: ${status} ${statusText}`);
        if (result.error) {
          console.log(`   Error: ${result.message}`);
        }
        console.log();
      });

      console.log('═══════════════════════════════════════════════');
      console.log('SUMMARY:');
      console.log(`  Total:           ${results.length}`);
      console.log(`  Terdaftar:       ${registeredCount}`);
      console.log(`  Tidak Terdaftar: ${notRegisteredCount}`);
      console.log(`  Error:           ${results.filter(r => r.error).length}`);
      console.log('═══════════════════════════════════════════════\n');

    } catch (error) {
      console.log(`\n❌ Error: ${error.message}\n`);
    }

    await this.pressEnter();
  }

  async showStats() {
    console.clear();
    console.log('\n═══ STATISTICS & LOGS ═══\n');

    const stats = this.validator.getStats();
    const recentLogs = this.validator.getLogs().slice(-10);

    console.log('📊 STATISTICS:');
    console.log('─────────────────────────────────────');
    console.log(`Cache Size:              ${stats.cacheSize}`);
    console.log(`Total Request Logs:      ${stats.requestLogSize}`);
    console.log(`Requests This Minute:    ${stats.requestsThisMinute}`);
    console.log('─────────────────────────────────────\n');

    console.log('📋 RECENT LOGS (Last 10):');
    console.log('─────────────────────────────────────');

    if (recentLogs.length === 0) {
      console.log('(No logs yet)');
    } else {
      recentLogs.forEach(log => {
        const level = log.level.padEnd(5);
        console.log(`[${log.timestamp}] ${level} ${log.message}`);
        if (Object.keys(log.data).length > 0) {
          console.log(`                          Data: ${JSON.stringify(log.data)}`);
        }
      });
    }

    console.log('─────────────────────────────────────\n');

    await this.pressEnter();
  }

  async pressEnter() {
    await question('Tekan Enter untuk melanjutkan...');
  }

  async run() {
    let running = true;

    while (running) {
      const choice = await this.showMainMenu();

      switch (choice) {
        case '1':
          await this.runSimpleValidator();
          break;
        case '2':
          await this.runAdvancedValidator();
          break;
        case '3':
          await this.runBatchValidator();
          break;
        case '4':
          await this.showStats();
          break;
        case '5':
          running = false;
          console.log('\n👋 Goodbye!\n');
          break;
        default:
          console.log('\n❌ Pilihan tidak valid!');
          await this.pressEnter();
      }
    }

    rl.close();
  }
}

// Run demo
const demo = new InteractiveDemo();
demo.run().catch(console.error);
