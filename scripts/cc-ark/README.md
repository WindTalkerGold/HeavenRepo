# cc-ark — Claude Code launcher for Volcengine Ark (火山方舟)

A small Windows launcher that picks a Volcengine Ark (火山方舟) model, sets the
Anthropic-compatible environment variables for the current session, and then
launches `claude` (Claude Code) in the current directory with permissions
skipped.

It is the CLI companion to the `/model-switch` skill — the model list is kept
in sync with that skill.

## Files

| File          | Purpose                                                         |
|---------------|-----------------------------------------------------------------|
| `cc-ark.ps1`  | The real launcher (PowerShell 5.1+).                            |
| `cc-ark.cmd`  | A thin shim so `cc-ark` works from cmd / PowerShell / git-bash / Windows Terminal. It just calls the `.ps1`. |

## What it does

1. **API key check** — if `ARK_API_KEY` is not set, it prompts you once via
   `Read-Host` (input is not echoed to console history), saves it to the
   **user** environment variable so future launches won't ask again, and uses
   it for the current process.
2. **Sets Ark endpoint** — `ANTHROPIC_BASE_URL = https://ark.cn-beijing.volces.com/api/coding`
   and `ANTHROPIC_AUTH_TOKEN = <ARK_API_KEY>`.
3. **Model selection** — shows the model list (number or name) and resolves
   your choice. Sets `ANTHROPIC_MODEL`, `ANTHROPIC_DEFAULT_OPUS_MODEL`,
   `ANTHROPIC_DEFAULT_SONNET_MODEL`, `CLAUDE_CODE_SUBAGENT_MODEL` to it. The
   Haiku slot (`ANTHROPIC_DEFAULT_HAIKU_MODEL`) is set to `deepseek-v4-flash`
   unless you already picked a flash model.
4. **Effort** — `CLAUDE_CODE_EFFORT_LEVEL = max`.
5. **Launches** `claude --dangerously-skip-permissions` in the current
   directory, forwarding any extra args.

## Supported models

| Model id              | Display name                  |
|-----------------------|-------------------------------|
| `doubao-seed-2.0-pro` | Doubao Seed 2.0 Pro           |
| `glm-5.2`             | GLM 5.2                       |
| `glm-5.2[1m]`         | GLM 5.2 (1M context)          |
| `deepseek-v4-flash`   | DeepSeek V4 Flash (fast/Haiku)|
| `deepseek-v4-pro`     | DeepSeek V4 Pro               |
| `deepseek-v4-pro[1m]` | DeepSeek V4 Pro (1M context)  |
| `kimi-k2.7-code`      | Kimi K2.7 Code                |

## Install / usage

1. Put `scripts/` (or a copy of both files) on your `PATH`.
2. From any directory open a terminal (cmd / PowerShell / Windows Terminal).
3. Run:
   ```bat
   cc-ark
   ```
4. First run: enter your Ark API key when prompted (saved to user env var).
5. Pick a model by number or name.
6. Claude Code launches in the current directory.

Pass-through args are forwarded to `claude`, e.g. `cc-ark --resume`.

## Security note — no hardcoded secrets

**This script contains no API keys, tokens, or secrets.** The only
credential reference is the `ARK_API_KEY` *environment variable name* — the
value is read from the environment (or entered interactively on first run)
and never written into the script or the repo. It is safe to commit and
share.

## Environment variables it reads / writes

| Variable                      | Role                                           |
|-------------------------------|------------------------------------------------|
| `ARK_API_KEY` (read)          | Your Ark API key; prompted + persisted if absent. |
| `ANTHROPIC_AUTH_TOKEN` (read) | Fallback token if `ARK_API_KEY` is unset.      |
| `ARK_API_KEY` (write, User)   | Persisted on first run so it survives sessions. |
| `ANTHROPIC_BASE_URL` (write)  | Set to the Ark coding endpoint for this process. |
| `ANTHROPIC_AUTH_TOKEN` (write)| Set to the resolved token for this process.    |
| `ANTHROPIC_MODEL`, `*_OPUS_MODEL`, `*_SONNET_MODEL`, `CLAUDE_CODE_SUBAGENT_MODEL` (write) | Set to the chosen model. |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` (write) | `deepseek-v4-flash` (or chosen flash model). |
| `CLAUDE_CODE_EFFORT_LEVEL` (write) | `max`. |

> Writes marked "this process" only affect the current terminal session;
> only `ARK_API_KEY` is persisted to the User environment scope.

## Dependencies

- Windows + PowerShell 5.1+ (`.cmd` invokes `powershell.exe`).
- `claude` (Claude Code CLI) on your `PATH`.
- A valid Volcengine Ark API key.
