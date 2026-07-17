@echo off
title VulnBatch
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Start-VulnBatch.ps1"
if errorlevel 1 (
  echo.
  pause
)
