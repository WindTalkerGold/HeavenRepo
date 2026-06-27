# HeavenRepo — Agentic Playground

A personal playground for building and shipping small agent-driven web experiments.
The `site/` directory is published as a static site via Azure Static Web Apps
(see `.github/workflows/`); every push to `master` deploys automatically.

## Structure

```
site/            Static site (Azure SWA app root)
  index.html     Landing page — links to the experiments below
  typing/        A typing-practice web app (vanilla JS)
.github/         CI/CD workflows (Azure Static Web Apps)
```

## Experiments

- **Typing** (`/typing/`) — a vanilla-JS typing practice app with Chinese /
  English drills and a local high-score board.

## Local preview

Open `site/index.html` directly, or serve the folder:

```bash
# from the repo root
python -m http.server -d site 8000
# then visit http://localhost:8000/
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
