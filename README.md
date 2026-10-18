# HeavenRepo — Agentic Playground

A personal playground for building and shipping small agent-driven web experiments.
The `site/` directory is a build-free static site deployed to Azure Static Web
Apps (`heavenrepo`, Free SKU). The [deployment workflow](.github/workflows/deploy-site.yml)
runs browser regression checks and publishes `site/` on pushes to `master`, or
when started manually in GitHub Actions. Deployment credentials live only in the
GitHub Actions secret `AZURE_STATIC_WEB_APPS_API_TOKEN_HEAVENREPO`.

- **Site:** https://victorious-sky-06718e300.1.azurestaticapps.net/
- **Time Together:** https://victorious-sky-06718e300.1.azurestaticapps.net/timezone/
- **Typing game:** https://victorious-sky-06718e300.1.azurestaticapps.net/typing/
- **Piano rhythm:** https://victorious-sky-06718e300.1.azurestaticapps.net/piano-rhythm/

This replaces the deleted `pages` deployment. The obsolete `xia` Azure site has
also been deleted; its separate GitHub source repository is retained.

## Structure

```
site/            Static site (Azure SWA app root)
  index.html     Landing page — links to the experiments below
  timezone/      World clocks + cross-timezone collaboration planner (Intl / ES Modules)
  typing/        A typing-practice web app (vanilla JS)
  piano-rhythm/  One-key piano rhythm game (ES Modules / Web Audio / Canvas)
.github/         CI/CD workflows (Azure Static Web Apps)
```

## Experiments

- **Time Together** (`/timezone/`) — live world clocks, searchable IANA zones,
  2–4 timezone availability windows, date-aware overlap calculation and copyable
  results. Handles DST, overnight windows and fractional UTC offsets. See
  [the timezone guide](site/timezone/README.md).

- **Typing** (`/typing/`) — six-stage Chinese / English typing practice with
  per-key synthesized notes, staff notation, a playable note chart, and current-round
  results only (no saved history). See [the typing guide](site/typing/README.md).
- **Piano Rhythm** (`/piano-rhythm/`) — four public-domain melody arrangements,
  Space/mouse/touch input, precise timing judgments, combo effects and current-round
  results. See [the rhythm guide](site/piano-rhythm/README.md).
- **AI Efficiency V2** (`/ai-efficiency-v2/`) — interactive presentation.
- **View HTML** (`/view-html/`) — offline ZIP presentation viewer.

## Local preview

Serve the folder (the piano game's ES Modules require HTTP, not `file://`):

```bash
# from the repo root
python -m http.server -d site 8000
# then visit http://localhost:8000/
```

## Game checks

Node.js 22.12+ and an installed Edge/Chrome browser are required:

```bash
npm ci
npm test             # rhythm/timezone unit tests + game/timezone browser checks
npm run test:typing  # typing only
npm run test:rhythm  # rhythm desktop + emulated touch
npm run test:timezone # world clocks + collaboration planner desktop/mobile
```

The test detects common browser locations; otherwise set `BROWSER_PATH` to the
browser executable. Tests run headlessly with a temporary browser profile and a
localhost-only server; they do not read or modify your personal score files.
These are development-only dependencies: `site/` still needs no install or build.

## License

Apache License 2.0 — see [LICENSE](LICENSE).
