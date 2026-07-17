@echo off
title Back Up VulnBatch Database
cd /d "%~dp0"
echo This creates a VulnBatch DATABASE backup.
echo.
echo A complete recovery set must also include the uploads and reports volumes.
echo See docs\backup-restore.md for the complete procedure.
echo.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\backup-db.ps1"
echo.
pause
