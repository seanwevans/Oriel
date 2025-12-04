#!/usr/bin/env node

const { Client } = require('ssh2');
const fs = require('fs');

function printUsage() {
  console.log(`Usage: node ssh-client.js --host <host> --username <user> [--password <pwd> | --key <path> [--passphrase <phrase>]] [--command <cmd> | --shell] [--port <port>]`);
  console.log('\nExamples:');
  console.log('  node ssh-client.js --host example.com --username root --password hunter2 --command "uptime"');
  console.log('  node ssh-client.js --host example.com --username root --key ~/.ssh/id_rsa --shell');
}

function parseArgs(argv) {
  const opts = { port: 22 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    const assign = (key, value) => {
      opts[key] = value;
      i++;
    };

    switch (arg) {
      case '--host':
        assign('host', next);
        break;
      case '--port':
        assign('port', parseInt(next, 10));
        break;
      case '--username':
        assign('username', next);
        break;
      case '--password':
        assign('password', next);
        break;
      case '--key':
        assign('privateKeyPath', next);
        break;
      case '--passphrase':
        assign('passphrase', next);
        break;
      case '--command':
        assign('command', next);
        break;
      case '--shell':
        opts.shell = true;
        break;
      case '--help':
      case '-h':
        opts.help = true;
        break;
      default:
        if (arg.startsWith('--')) {
          const [flag, value] = arg.split('=');
          const flagName = flag.replace(/^--/, '');
          const normalized = flagName.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
          opts[normalized] = value ?? true;
        }
        break;
    }
  }
  return opts;
}

function validateOptions(opts) {
  if (opts.help) return false;
  if (!opts.host || !opts.username) {
    console.error('Missing required --host or --username');
    return false;
  }
  if (!opts.password && !opts.privateKeyPath) {
    console.error('Provide either --password or --key');
    return false;
  }
  return true;
}

function buildConnectionConfig(opts) {
  const config = {
    host: opts.host,
    port: opts.port || 22,
    username: opts.username,
    readyTimeout: 15000,
    keepaliveInterval: 10000,
  };

  if (opts.password) config.password = opts.password;
  if (opts.privateKeyPath) config.privateKey = fs.readFileSync(opts.privateKeyPath);
  if (opts.passphrase) config.passphrase = opts.passphrase;
  return config;
}

function startShell(conn) {
  conn.shell({ term: process.env.TERM || 'xterm-color' }, (err, stream) => {
    if (err) {
      console.error('Failed to start shell:', err.message);
      conn.end();
      return;
    }

    if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
      process.stdin.setRawMode(true);
    }

    process.stdin.pipe(stream);
    stream.pipe(process.stdout);

    stream.on('close', () => {
      process.stdin.unpipe(stream);
      if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
        process.stdin.setRawMode(false);
      }
      conn.end();
    });
  });
}

function runCommand(conn, command) {
  conn.exec(command || 'echo "Connected"', (err, stream) => {
    if (err) {
      console.error('Failed to run command:', err.message);
      conn.end();
      return;
    }

    stream
      .on('close', (code, signal) => {
        if (code !== 0) {
          console.error(`Command exited with code ${code}${signal ? ` (signal ${signal})` : ''}`);
        }
        conn.end();
      })
      .on('data', (data) => process.stdout.write(data))
      .stderr.on('data', (data) => process.stderr.write(data));
  });
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help || !validateOptions(opts)) {
    printUsage();
    process.exit(opts.help ? 0 : 1);
  }

  const config = buildConnectionConfig(opts);
  const conn = new Client();

  conn
    .on('ready', () => {
      if (opts.shell) {
        startShell(conn);
      } else {
        runCommand(conn, opts.command);
      }
    })
    .on('error', (err) => {
      console.error('SSH connection error:', err.message);
    })
    .on('end', () => {
      if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
        process.stdin.setRawMode(false);
      }
    })
    .connect(config);
}

if (require.main === module) {
  main();
}
