#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const AdvancedAmazonValidator = require('./advancedValidator');
const { buildProxyUrl } = require('./amazonEmailValidator');

// Shared validator instance to reuse cache and rate limiting
const validator = new AdvancedAmazonValidator({
  enableLogging: false,
  rateLimitPerMinute: 90
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanEmail(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  const emailOnly = trimmed.includes(':') ? trimmed.split(':')[0].trim() : trimmed;
  return emailOnly;
}

function normalizeEmails(rawList) {
  const seen = new Set();
  const emails = [];

  rawList.forEach(item => {
    const email = cleanEmail(item);
    if (!email || !emailRegex.test(email)) return;
    if (seen.has(email.toLowerCase())) return;
    seen.add(email.toLowerCase());
    emails.push(email);
  });

  return emails;
}

function parseInlineList(text) {
  if (!text) return [];
  const parts = text
    .split(/\r?\n|,/)
    .map(piece => piece.trim())
    .filter(Boolean);
  return normalizeEmails(parts);
}

function parseCsvContent(content) {
  return normalizeEmails(
    content
      .split(/\r?\n/)
      .map(line => line.split(',')[0])
  );
}

function parseTxtContent(content) {
  return normalizeEmails(content.split(/\r?\n/));
}

function loadEmailsFromFile(filePath) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const ext = path.extname(absolutePath).toLowerCase();

  if (ext === '.csv') {
    return parseCsvContent(content);
  }

  return parseTxtContent(content);
}

function formatSingleResult(email, result) {
  const status = result.isRegistered ? 'OK' : 'NOT-FOUND';
  const code = result.statusCode || 0;
  return `${status.padEnd(11)} | ${code.toString().padEnd(3)} | ${email} | ${result.message}`;
}

function printBatchTable(results) {
  if (!Array.isArray(results) || results.length === 0) {
    console.log('No results to display.');
    return;
  }

  const longestEmail = Math.min(
    Math.max(...results.map(r => (r.email || '').length)),
    64
  );

  const header = `#   | ${'Status'.padEnd(11)} | ${'Code'.padEnd(4)} | ${'Email'.padEnd(longestEmail)} | Message`;
  console.log(header);
  console.log('-'.repeat(header.length));

  results.forEach((r, idx) => {
    const status = r.error ? 'ERROR' : r.isRegistered ? 'OK' : 'NOT-FOUND';
    const code = (r.statusCode || r.responseCode || 0).toString();
    const email = (r.email || '').padEnd(longestEmail).slice(0, longestEmail);
    const message = r.message || '';
    console.log(`${String(idx + 1).padEnd(3)} | ${status.padEnd(11)} | ${code.padEnd(4)} | ${email} | ${message}`);
  });
}

async function validateSingle(email, proxy) {
  const cleaned = cleanEmail(email);
  if (!cleaned) throw new Error('Email is required');
  if (!emailRegex.test(cleaned)) throw new Error('Format email tidak valid');

  const result = await validator.validate(cleaned, { proxy });
  console.log('\nResult');
  console.log('-------');
  console.log(formatSingleResult(cleaned, result));
}

async function validateBatch(emails, options = {}) {
  const normalized = normalizeEmails(emails);
  if (normalized.length === 0) throw new Error('No valid emails provided');

  const delayMs = Number.isFinite(options.delayMs) ? options.delayMs : 1000;
  const proxy = options.proxy || null;
  const results = await validator.validateBatch(normalized, {
    delayMs,
    proxy,
    stopOnError: false
  });

  console.log(`\nProcessed ${results.length} email(s) with ${delayMs} ms delay${proxy ? ' via proxy' : ''}.`);
  printBatchTable(results);

  const summary = {
    total: results.length,
    registered: results.filter(r => r.isRegistered).length,
    notRegistered: results.filter(r => !r.isRegistered && !r.error).length,
    errors: results.filter(r => r.error).length
  };

  console.log('\nSummary');
  console.log('-------');
  console.log(`Registered   : ${summary.registered}`);
  console.log(`Not registered: ${summary.notRegistered}`);
  console.log(`Errors       : ${summary.errors}`);
}

function parseArgs(argv) {
  const opts = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--email' && argv[i + 1]) {
      opts.email = argv[++i];
      continue;
    }

    if (arg === '--file' && argv[i + 1]) {
      opts.file = argv[++i];
      continue;
    }

    if (arg === '--list' && argv[i + 1]) {
      opts.list = argv[++i];
      continue;
    }

    if (arg === '--delay' && argv[i + 1]) {
      opts.delay = Number(argv[++i]);
      continue;
    }

    if (arg === '--proxy' && argv[i + 1]) {
      opts.proxy = argv[++i];
      continue;
    }

    if (arg === '-h' || arg === '--help') {
      opts.help = true;
      continue;
    }
  }

  return opts;
}

function printHelp() {
  console.log('Amazon Email Validator - CLI');
  console.log('Simple & elegant CLI that mirrors the GUI features.');
  console.log('\nQuick usage (non-interactive):');
  console.log('  node cli.js --email user@example.com [--proxy ip:port]');
  console.log('  node cli.js --list "a@b.com,c@d.com" [--delay 1200] [--proxy ip:port]');
  console.log('  node cli.js --file emails.txt [--delay 1000] [--proxy ip:port]');
  console.log('\nInteractive mode:');
  console.log('  node cli.js');
}

async function runNonInteractive(opts) {
  if (opts.help) {
    printHelp();
    return;
  }

  const proxy = opts.proxy ? buildProxyUrl(opts.proxy) : null;

  if (opts.email) {
    await validateSingle(opts.email, proxy);
    return;
  }

  const emails = [];

  if (opts.list) {
    emails.push(...parseInlineList(opts.list));
  }

  if (opts.file) {
    emails.push(...loadEmailsFromFile(opts.file));
  }

  if (emails.length === 0) {
    throw new Error('Provide --email, --list, or --file. Use --help for examples.');
  }

  await validateBatch(emails, { delayMs: opts.delay, proxy });
}

function createPrompt() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, prompt) {
  return new Promise(resolve => rl.question(prompt, answer => resolve(answer.trim())));
}

async function interactiveMenu() {
  const rl = createPrompt();
  let running = true;

  while (running) {
    console.log('\nAmazon Email Validator - CLI');
    console.log('--------------------------------');
    console.log('1) Validate single email');
    console.log('2) Validate batch (paste)');
    console.log('3) Validate from file (txt/csv)');
    console.log('4) View stats');
    console.log('5) Clear cache');
    console.log('6) Exit');

    const choice = await ask(rl, 'Choose an option: ');

    try {
      switch (choice) {
        case '1': {
          const email = await ask(rl, 'Email: ');
          const proxy = await ask(rl, 'Proxy (ip:port or leave blank): ');
          await validateSingle(email, proxy ? buildProxyUrl(proxy) : null);
          break;
        }
        case '2': {
          console.log('Paste emails (blank line to finish):');
          const collected = [];
          while (true) {
            const line = await ask(rl, '');
            if (!line) break;
            collected.push(line);
          }
          const delayInput = await ask(rl, 'Delay between requests in ms (default 1000): ');
          const proxy = await ask(rl, 'Proxy (ip:port or leave blank): ');
          await validateBatch(collected, {
            delayMs: delayInput ? Number(delayInput) : 1000,
            proxy: proxy ? buildProxyUrl(proxy) : null
          });
          break;
        }
        case '3': {
          const filePath = await ask(rl, 'Path to txt/csv: ');
          const delayInput = await ask(rl, 'Delay between requests in ms (default 1000): ');
          const proxy = await ask(rl, 'Proxy (ip:port or leave blank): ');
          const emails = loadEmailsFromFile(filePath);
          await validateBatch(emails, {
            delayMs: delayInput ? Number(delayInput) : 1000,
            proxy: proxy ? buildProxyUrl(proxy) : null
          });
          break;
        }
        case '4': {
          const stats = validator.getStats();
          console.log('\nStats');
          console.log('-----');
          console.log(`Cache entries      : ${stats.cacheSize}`);
          console.log(`Log entries        : ${stats.requestLogSize}`);
          console.log(`Requests last 60s  : ${stats.requestsThisMinute}`);
          break;
        }
        case '5': {
          validator.clearCache();
          console.log('Cache cleared.');
          break;
        }
        case '6':
          running = false;
          break;
        default:
          console.log('Invalid choice.');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  rl.close();
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.email || opts.list || opts.file || opts.help) {
    await runNonInteractive(opts);
    return;
  }

  await interactiveMenu();
}

main().catch(err => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
