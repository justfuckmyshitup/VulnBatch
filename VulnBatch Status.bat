@echo off
title VulnBatch Status
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Status-VulnBatch.ps1"
echo.
pause
