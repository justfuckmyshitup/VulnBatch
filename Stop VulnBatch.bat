@echo off
title Stop VulnBatch
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Stop-VulnBatch.ps1"
echo.
pause
