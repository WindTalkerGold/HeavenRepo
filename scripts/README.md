# scripts/

A collection of standalone CLI scripts/launchers. Each script lives in **its
own folder**, so every folder is self-contained and can be added to `PATH`
independently.

## Layout convention

```
scripts/
  cc-ark/                  # one script per folder
    cc-ark.ps1             # the script itself
    cc-ark.cmd             # shim (if needed for cross-shell launch)
    README.md              # what it does + how to use it
  <next-script>/
    ...
  README.md                # this index
```

Each folder contains:

- the executable script(s),
- any shims/wrappers,
- a `README.md` describing its purpose, usage, dependencies, and any
  security notes.

## Adding scripts to PATH

Because each folder holds a complete, runnable script, the simplest way to
make a script available everywhere is to add **its folder** to your `PATH`.

### Option A — add one folder at a time (recommended)

Add only the folders you actually use:

```powershell
# Current user, permanent (run once per script folder)
[Environment]::SetEnvironmentVariable(
  "Path",
  "$([Environment]::GetEnvironmentVariable('Path','User'));$env:USERPROFILE\path\to\HeavenRepo\scripts\cc-ark",
  "User")
```

Or via the GUI: **Settings → System → About → Advanced system settings →
Environment Variables → Path (User) → New**, and add the folder's absolute
path (e.g. `D:\Coding\HeavenRepo\scripts\cc-ark`).

### Option B — add the whole `scripts/` tree

Add **every** subfolder at once (new script folders then become available
automatically). Append this to your user `PATH`:

```
D:\Coding\HeavenRepo\scripts\cc-ark
D:\Coding\HeavenRepo\scripts\<next>
...
```

(Windows `PATH` does not recurse, so each subfolder must be listed
explicitly. A small bootstrap script can enumerate `scripts\*` and prepend
them — see the note below.)

Open a **new** terminal after changing `PATH` for it to take effect.

## Scripts

| Folder     | What it is                                                                |
|------------|---------------------------------------------------------------------------|
| [`cc-ark/`](cc-ark/) | Claude Code launcher for Volcengine Ark (火山方舟) — pick a model, set env, launch `claude`. |

> Add new scripts by creating a new subfolder following the layout above and
> adding a row to this table.

---

### Bootstrap snippet (optional) — prepend all script folders to PATH

Save as e.g. `scripts/add-scripts-to-path.ps1` and run it once; it lists
every subfolder of `scripts/` on the user `PATH`:

```powershell
$root = Join-Path $PSScriptRoot ''  # this scripts/ folder
$userPath = [Environment]::GetEnvironmentVariable('Path','User')
$folders  = Get-ChildItem $root -Directory | ForEach-Object { $_.FullName }
$existing = ($userPath -split ';') | Where-Object { $_ }
$toAdd    = $folders | Where-Object { $_ -notin $existing }
if ($toAdd) {
  $new = ($existing + $toAdd) -join ';'
  [Environment]::SetEnvironmentVariable('Path', $new, 'User')
  Write-Host "Added to user PATH:" -ForegroundColor Green
  $toAdd | ForEach-Object { Write-Host "  $_" }
} else {
  Write-Host "All script folders already on PATH." -ForegroundColor Yellow
}
```

> Only a sketch — review before running. It only ever **adds** folders, never
> removes existing PATH entries.
