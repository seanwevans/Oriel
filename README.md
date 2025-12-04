# Oriel
<img width="2935" height="1659" alt="screen" src="screen.png" />
Oriel is a small retro desktop simulation built with vanilla HTML, CSS, and JavaScript.

## SSH client

An accompanying Node.js SSH client is available via [`ssh-client.js`](ssh-client.js). Install dependencies and run commands over SSH with the `ssh2` library:

```bash
npm install
node ssh-client.js --host example.com --username root --password hunter2 --command "uptime"
```

To start an interactive shell session with a private key instead of a password:

```bash
node ssh-client.js --host example.com --username root --key ~/.ssh/id_rsa --shell
```
