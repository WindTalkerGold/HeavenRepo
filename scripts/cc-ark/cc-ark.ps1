#requires -Version 5.1
<#
.SYNOPSIS
  cc-ark - Claude Code launcher for Volcengine Ark (火山方舟).
.DESCRIPTION
  Lets you pick a model from the same list used by the /model-switch skill,
  sets the Anthropic-compatible environment variables for the current session,
  then launches `claude` in the current directory with skip-permissions.

  使用方法:
  1. 将此脚本和 cc-ark.cmd 放入 PATH 环境变量包含的目录中
  2. 在任意目录下打开 cmd/PowerShell/Windows Terminal
  3. 输入 `cc-ark` 启动
  4. 首次运行会提示输入 ARK_API_KEY，输入后会自动保存到用户环境变量
  5. 选择要使用的模型（输入编号或名称）
  6. 自动启动 Claude Code

  环境变量:
  - ARK_API_KEY: 火山方舟 API Key（首次运行会提示输入并自动保存）
  - ANTHROPIC_BASE_URL: 自动设置为 https://ark.cn-beijing.volces.com/api/coding
  - ANTHROPIC_AUTH_TOKEN: 自动设置为 ARK_API_KEY
  - ANTHROPIC_MODEL / DEFAULT_OPUS_MODEL / DEFAULT_SONNET_MODEL: 根据选择自动设置
  - ANTHROPIC_DEFAULT_HAIKU_MODEL: 自动设置为 fast flash 变体
  - CLAUDE_CODE_SUBAGENT_MODEL: 与选择的模型一致
  - CLAUDE_CODE_EFFORT_LEVEL: 自动设置为 max

  模型列表:
  - doubao-seed-2.0-pro  - Doubao Seed 2.0 Pro
  - glm-5.2              - GLM 5.2
  - glm-5.2[1m]          - GLM 5.2 (1M context)
  - deepseek-v4-flash    - DeepSeek V4 Flash (fast, Haiku)
  - deepseek-v4-pro      - DeepSeek V4 Pro
  - deepseek-v4-pro[1m]  - DeepSeek V4 Pro (1M context)
  - kimi-k2.7-code       - Kimi K2.7 Code
#>

$ErrorActionPreference = 'Stop'

# --- ARK_API_KEY auto-check ---------------------------------------------------
if ([string]::IsNullOrWhiteSpace($env:ARK_API_KEY)) {
    Write-Host ''
    Write-Host 'WARNING: ARK_API_KEY environment variable is not set.' -ForegroundColor Yellow
    Write-Host '    Please provide your Ark API Key (input is not recorded to console history).' -ForegroundColor Yellow
    Write-Host '    Press Enter without input to exit.' -ForegroundColor Yellow
    Write-Host ''
    $userKey = Read-Host 'ARK_API_KEY'
    if ([string]::IsNullOrWhiteSpace($userKey)) {
        Write-Host 'No API Key provided, exiting.' -ForegroundColor Red
        exit 1
    }
    # Set for the current process
    $env:ARK_API_KEY = $userKey
    # Persist at user level so future launches won't ask again
    [Environment]::SetEnvironmentVariable('ARK_API_KEY', $userKey, 'User')
    Write-Host "ARK_API_KEY has been saved to user environment variable (persistent)." -ForegroundColor Green
} else {
    Write-Host "ARK_API_KEY already exists." -ForegroundColor Green
}

# --- Ark endpoint & token -----------------------------------------------------
$arkBaseUrl = 'https://ark.cn-beijing.volces.com/api/coding'

# Token precedence: explicit ARK_API_KEY -> inherited ANTHROPIC_AUTH_TOKEN.
# No key is ever hardcoded in this script — it is read from the environment
# or prompted interactively on first run (see the ARK_API_KEY auto-check above).
$arkToken = $env:ARK_API_KEY
if ([string]::IsNullOrWhiteSpace($arkToken)) { $arkToken = $env:ANTHROPIC_AUTH_TOKEN }

# --- Model list (mirrors /model-switch) ---------------------------------------
$models = [ordered]@{
    'doubao-seed-2.0-pro' = 'Doubao Seed 2.0 Pro'
    'glm-5.2'             = 'GLM 5.2'
    'glm-5.2[1m]'         = 'GLM 5.2 (1M context)'
    'deepseek-v4-flash'   = 'DeepSeek V4 Flash (fast, Haiku)'
    'deepseek-v4-pro'     = 'DeepSeek V4 Pro'
    'deepseek-v4-pro[1m]' = 'DeepSeek V4 Pro (1M context)'
    'kimi-k2.7-code'      = 'Kimi K2.7 Code'
}

function Show-Models {
    Write-Host ''
    Write-Host 'Available Models (Volcengine Ark):' -ForegroundColor Cyan
    Write-Host ('-' * 54)
    $i = 1
    foreach ($kv in $models.GetEnumerator()) {
        '{0,2}. {1,-22} - {2}' -f $i, $kv.Key, $kv.Value | Write-Host
        $i++
    }
    Write-Host ('-' * 54)
}

function Resolve-Model {
    param([string]$Selection)
    if ([string]::IsNullOrWhiteSpace($Selection)) { return $null }
    $s = $Selection.Trim()

    # By number
    if ($s -match '^\d+$') {
        $idx = [int]$s
        if ($idx -ge 1 -and $idx -le $models.Count) {
            return ($models.Keys | Select-Object -Skip ($idx - 1) -First 1)
        }
    }
    # By name (case-insensitive, also accept without the [1m] suffix etc.)
    $match = $models.Keys | Where-Object { $_ -ieq $s }
    if ($match) { return $match }
    $match = $models.Keys | Where-Object { $_ -like "*$s*" }
    if ($match.Count -eq 1) { return $match }
    return $null
}

# --- Pick model ----------------------------------------------------------------
Show-Models
$selectedModel = $null
while (-not $selectedModel) {
    $choice = Read-Host 'Select model (number or name, Enter to abort)'
    if ([string]::IsNullOrWhiteSpace($choice)) {
        Write-Host 'Aborted.' -ForegroundColor Yellow
        exit 1
    }
    $selectedModel = Resolve-Model $choice
    if (-not $selectedModel) {
        Write-Host '  Invalid selection, try again.' -ForegroundColor Red
    }
}

# Haiku slot: use the fast flash variant unless the user already picked it.
$haikuModel = if ($selectedModel -like '*flash*') { $selectedModel } else { 'deepseek-v4-flash' }

# --- Set environment variables (current session only) -------------------------
$env:ANTHROPIC_BASE_URL              = $arkBaseUrl
$env:ANTHROPIC_AUTH_TOKEN            = $arkToken
$env:ANTHROPIC_MODEL                 = $selectedModel
$env:ANTHROPIC_DEFAULT_OPUS_MODEL    = $selectedModel
$env:ANTHROPIC_DEFAULT_SONNET_MODEL  = $selectedModel
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL   = $haikuModel
$env:CLAUDE_CODE_SUBAGENT_MODEL      = $selectedModel
$env:CLAUDE_CODE_EFFORT_LEVEL        = 'max'

Write-Host ''
Write-Host 'Launching Claude Code with:' -ForegroundColor Green
Write-Host "  BASE_URL : $arkBaseUrl"
Write-Host "  MODEL    : $selectedModel"
Write-Host "  HAIKU    : $haikuModel"
Write-Host "  EFFORT   : max"
Write-Host ''

# --- Launch claude in the current directory -----------------------------------
& claude --dangerously-skip-permissions @args
