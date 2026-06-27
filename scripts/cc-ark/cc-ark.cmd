@echo off
REM cc-ark - launcher shim that runs cc-ark.ps1 in PowerShell.
REM Works from cmd / PowerShell / git-bash / Windows Terminal.
REM
REM 使用方法:
REM 1. 将此文件和 cc-ark.ps1 一起放入 PATH 环境变量包含的目录
REM 2. 在任意目录下直接输入 cc-ark 启动
REM 3. 首次运行会提示输入 ARK_API_KEY
REM 4. 选择模型后自动启动 Claude Code
REM
REM 依赖: cc-ark.ps1 (需要与本文件在同一目录)
REM
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0cc-ark.ps1" %*
