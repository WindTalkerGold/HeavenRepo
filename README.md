# HeavenRepo — Agentic Playground

A personal playground for building and shipping small agent-driven web experiments.
The `site/` directory is a build-free static site deployed to Azure Static Web
Apps (`heavenrepo`, Free SKU). The [deployment workflow](.github/workflows/deploy-site.yml)
runs browser regression checks and publishes `site/` on pushes to `master`, or
when started manually in GitHub Actions. Deployment credentials live only in the
GitHub Actions secret `AZURE_STATIC_WEB_APPS_API_TOKEN_HEAVENREPO`.

- **Site:** https://victorious-sky-06718e300.1.azurestaticapps.net/
- **Typing game:** https://victorious-sky-06718e300.1.azurestaticapps.net/typing/

This replaces the deleted `pages` deployment; the separate `xia` site is unchanged.

## Structure

```
site/            Static site (Azure SWA app root)
  index.html     Landing page — links to the experiments below
  typing/        A typing-practice web app (vanilla JS)
.github/         CI/CD workflows (Azure Static Web Apps)
```

## Experiments

- **Typing** (`/typing/`) — six-stage Chinese / English typing practice with
  per-key synthesized notes, staff notation, a playable note chart, and local
  high scores. See [the typing guide](site/typing/README.md).
- **AI Efficiency V2** (`/ai-efficiency-v2/`) — interactive presentation.
- **View HTML** (`/view-html/`) — offline ZIP presentation viewer.

## Local preview

Open `site/index.html` directly, or serve the folder:

```bash
# from the repo root
python -m http.server -d site 8000
# then visit http://localhost:8000/
```

## Typing browser checks

Node.js 22.12+ and an installed Edge/Chrome browser are required:

```bash
npm ci
npm test
```

The test detects common browser locations; otherwise set `BROWSER_PATH` to the
browser executable. Tests run headlessly with a temporary browser profile and a
localhost-only server; they do not read or modify your personal score files.
These are development-only dependencies: `site/` still needs no install or build.

## License

Apache License 2.0 — see [LICENSE](LICENSE).
