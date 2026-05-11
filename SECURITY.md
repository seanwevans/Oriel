# Security Policy

Thank you for helping keep Oriel and its users safe. This document explains how to report vulnerabilities, which versions are supported, how security issues are handled, and the secure-development expectations for contributors.

## Supported Versions

Oriel is currently released from the `main` branch and does not maintain long-lived version branches. Security fixes are applied to the latest code on `main` and included in the next public deployment or release.

| Version | Supported |
| --- | --- |
| `main` / latest live demo | Yes |
| Historical commits, forks, or unpublished local builds | No |

If this policy changes, maintainers should update this table and document the supported release lines.

## Reporting a Vulnerability

Please report suspected security vulnerabilities privately. Do **not** open a public GitHub issue, discussion, or pull request that contains exploit details until maintainers have had a chance to investigate and coordinate a fix.

Preferred reporting channels, in order:

1. Use GitHub's private vulnerability reporting feature for this repository, if enabled.
2. If private vulnerability reporting is unavailable, contact the repository owner through the contact information on their GitHub profile and include `Oriel security report` in the subject or first line.
3. If no private channel is available, open a minimal public issue that says you would like to report a security vulnerability, but do not include technical details, payloads, credentials, logs containing secrets, or proof-of-concept code.

When reporting, include as much of the following as you can safely share:

- Affected component, application, file, route, or feature.
- A concise description of the vulnerability and its likely impact.
- Reproduction steps using the latest `main` branch when possible.
- Browser, operating system, Node.js, and npm versions used during testing.
- Any relevant screenshots, console output, request/response metadata, or proof-of-concept files.
- Whether the vulnerability is actively exploited or publicly known.
- Your preferred name, handle, and contact method for follow-up and credit.

## Response Expectations

This is a volunteer-maintained project, but maintainers should use the following targets whenever possible:

| Step | Target |
| --- | --- |
| Initial acknowledgement | Within 7 calendar days |
| Initial triage and severity assessment | Within 14 calendar days |
| Remediation plan for accepted reports | Within 30 calendar days |
| Public disclosure after fix availability | Coordinated with the reporter |

Maintainers may need more time for complex issues, browser-specific behavior, supply-chain reports, or vulnerabilities that depend on third-party services. Reporters will be updated when timelines change.

## Scope

Security reports are most useful when they affect Oriel's application code, build process, dependencies, or user data handling. In-scope examples include:

- Cross-site scripting, HTML injection, unsafe Markdown rendering, or DOM clobbering.
- Unsafe handling of user-created files, imported filesystem snapshots, or native folder mounts.
- Network proxy misuse, server-side request forgery through configurable proxy endpoints, or unsafe handling of fetched remote content.
- Leaking secrets, API keys, tokens, browser storage contents, or local filesystem data.
- Dependency confusion, compromised dependency updates, malicious build artifacts, or reproducible supply-chain weaknesses.
- Security regressions in apps that call third-party APIs, compile or run user-supplied code, display remote feeds, or render uploaded media.

Out-of-scope examples include:

- Vulnerabilities that require a modified browser, disabled browser security controls, or local malware on the user's device.
- Reports against third-party services themselves, unless Oriel exposes users to those issues in a new way.
- Denial-of-service reports based only on opening many windows, large files, or intentionally exhausting local browser resources without a security boundary impact.
- Social engineering, phishing, physical attacks, or account takeover of services not controlled by this project.
- Findings from automated scanners without a demonstrated, reproducible impact.

## Project Security Model

Oriel is a client-side retro desktop simulation built with Vite and vanilla JavaScript. It runs in the user's browser and relies on browser security boundaries. There is no trusted backend in the default application.

Important security assumptions:

- Data stored by Oriel in `localStorage` or IndexedDB is local to the user's browser profile and should not be treated as encrypted or secret.
- Native filesystem access depends on the browser's File System Access API and requires explicit user permission.
- Environment variables prefixed with `VITE_` are embedded into browser-delivered code at build time and must be considered public.
- Third-party APIs, proxy services, media streams, RSS feeds, remote pages, and game or compiler integrations can be unavailable, malicious, or return malformed data.
- Apps that display user-supplied text, Markdown, remote feed content, headers, database rows, packet logs, or API responses must treat that content as untrusted.

## Secure Configuration Guidance

When deploying or running Oriel:

- Do not place private tokens, passwords, API keys, or internal hostnames in `VITE_` environment variables.
- Prefer HTTPS URLs for `VITE_BROWSER_HOME`, `VITE_BROWSER_PROXY_PREFIX`, `VITE_RADIO_BROWSER_BASE`, `VITE_RADIO_GARDEN_PROXY`, `VITE_RSS_PROXY_ROOT`, and `VITE_MAIL_PROXY_ROOT`.
- Use proxy services that enforce allowlists, size limits, timeouts, content-type restrictions, and logging appropriate for your deployment.
- Do not configure browser, RSS, mail, or radio proxies that can access private networks unless that behavior is explicitly intended and protected.
- Review Content Security Policy, framing, referrer, and permission headers for the hosting environment.
- Treat the live demo and local development builds as public web applications, not trusted sandboxes for secrets.

## Contributor Security Requirements

Contributors should follow these practices for all changes:

- Prefer safe DOM APIs such as `textContent`, `createElement`, `setAttribute`, and explicit URL parsing over concatenating untrusted strings into `innerHTML`.
- If HTML rendering is required, sanitize input with a well-reviewed approach and document why raw HTML is safe in that context.
- Validate and normalize URLs before fetching or displaying them. Restrict protocols to `http:` and `https:` unless a feature explicitly requires another protocol.
- Never log, persist, or render secrets such as API tokens, OAuth credentials, cookies, authorization headers, or private file contents unless the user explicitly requested it and the UI clearly communicates the risk.
- Avoid adding new dependencies for small tasks. When dependencies are necessary, choose maintained packages, pin them through the lockfile, and review transitive dependency impact.
- Keep network requests cancellable where practical and handle malformed responses, large payloads, timeouts, and non-2xx responses safely.
- Ensure imported/exported virtual filesystem data is validated before use.
- Avoid broad permissions in browser APIs; request the minimum capability at the latest practical moment.
- Do not commit `.env` files, credentials, private test fixtures, local browser profiles, or generated artifacts containing secrets.

## Dependency and Supply-Chain Security

The project uses npm and a lockfile. Maintainers and contributors should:

- Run `npm install` or `npm ci` from a clean checkout to respect `package-lock.json`.
- Review lockfile changes in pull requests.
- Run `npm audit` when investigating dependency issues and evaluate findings for actual browser-side exploitability.
- Prefer small, actively maintained dependencies with clear provenance.
- Avoid postinstall scripts and dependency changes that are not necessary for the feature or fix.

## Local Security Checks

Before submitting security-sensitive changes, run the relevant checks:

```bash
npm test
npm run build
npm audit
```

Also manually test browser flows that are difficult to cover with automated tests, especially features involving remote content, user-created documents, virtual files, native directory mounts, or third-party APIs.

## Disclosure and Credit

Maintainers will coordinate public disclosure with the reporter after a fix is available. Public advisories, release notes, or changelog entries should avoid publishing exploit details until users have had a reasonable opportunity to update or redeploy.

Reporters may request credit by name, handle, or organization. Maintainers will honor reasonable requests for anonymity.

## Safe Harbor

Good-faith security research is welcome when it follows this policy. Researchers should:

- Avoid accessing, modifying, deleting, or exfiltrating data that does not belong to them.
- Avoid privacy violations, service disruption, spam, destructive testing, and social engineering.
- Stop testing and report promptly if they discover sensitive data or an active compromise.
- Give maintainers a reasonable opportunity to investigate and remediate before public disclosure.

Maintainers will not pursue action against good-faith researchers who comply with this policy and avoid harming users or services.
