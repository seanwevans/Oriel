const fs = require("fs");
const path = require("path");
const FTPClient = require("ftp");

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      options[key] = value;
    }
  }
  return options;
}

function printUsage() {
  console.log(`Usage: node ftp-client.js --host <host> --user <username> --password <password> [options]

Options:
  --port <port>           FTP server port (default: 21)
  --list <path>           List the contents of a remote directory
  --download <remote>     Download a remote file
  --upload <local>        Upload a local file
  --dest <path>           Destination path for upload/download (defaults to basename)
  --secure                Use explicit FTPS if supported by the server
  --help                  Show this help text

Examples:
  node ftp-client.js --host ftp.example.com --user demo --password demo --list /
  node ftp-client.js --host ftp.example.com --user demo --password demo --download /remote/file.txt --dest ./file.txt
  node ftp-client.js --host ftp.example.com --user demo --password demo --upload ./local.txt --dest /incoming/local.txt
`);
}

function connect(config) {
  return new Promise((resolve, reject) => {
    const client = new FTPClient();
    let settled = false;

    client.once("ready", () => {
      settled = true;
      resolve(client);
    });

    client.once("error", (err) => {
      if (!settled) {
        reject(err);
      } else {
        console.error("FTP error:", err.message);
      }
    });

    client.connect({
      host: config.host,
      user: config.user,
      password: config.password,
      port: Number(config.port) || 21,
      secure: Boolean(config.secure),
    });
  });
}

function listDirectory(client, remotePath) {
  return new Promise((resolve, reject) => {
    client.list(remotePath, (err, list) => {
      if (err) return reject(err);
      resolve(list);
    });
  });
}

function downloadFile(client, remotePath, destPath) {
  return new Promise((resolve, reject) => {
    client.get(remotePath, (err, stream) => {
      if (err) return reject(err);
      const writeStream = fs.createWriteStream(destPath);
      stream.once("close", resolve);
      stream.once("error", reject);
      stream.pipe(writeStream);
    });
  });
}

function uploadFile(client, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    client.put(localPath, remotePath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function run() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || !options.host || !options.user || !options.password) {
    printUsage();
    process.exit(options.help ? 0 : 1);
  }

  if (!options.list && !options.download && !options.upload) {
    console.error("No action provided. Use --list, --download, or --upload.");
    printUsage();
    process.exit(1);
  }

  if (options.upload && !fs.existsSync(options.upload)) {
    console.error(`Local file not found: ${options.upload}`);
    process.exit(1);
  }

  const client = await connect(options);

  try {
    if (options.list) {
      const entries = await listDirectory(client, options.list);
      entries.forEach((entry) => {
        console.log(`${entry.type === "d" ? "<DIR>" : "     "} ${entry.date.toISOString()} ${entry.name}`);
      });
    }

    if (options.download) {
      const destination = options.dest || path.basename(options.download);
      await downloadFile(client, options.download, destination);
      console.log(`Downloaded ${options.download} -> ${destination}`);
    }

    if (options.upload) {
      const remoteDest = options.dest || path.basename(options.upload);
      await uploadFile(client, options.upload, remoteDest);
      console.log(`Uploaded ${options.upload} -> ${remoteDest}`);
    }
  } finally {
    client.end();
  }
}

run().catch((err) => {
  console.error("FTP client failed:", err.message);
  process.exit(1);
});
