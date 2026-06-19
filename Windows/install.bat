@echo off
title PortLLM - Setup
color 0E

echo ===================================================
echo     PORTLLM - USB SETUP
echo ===================================================
echo.
echo  This will download and configure AI models onto
echo  your USB drive. You'll get to CHOOSE which models
echo  to install from a curated list.
echo.
echo   - 6 preset models (advanced + standard)
echo   - Custom model support (bring your own GGUF)
echo   - Minimum drive space: 8 GB (16 GB recommended)
echo.
echo  Make sure you have a good internet connection!
echo.
pause

:: Run the PowerShell setup script from the same folder as this bat file
powershell -ExecutionPolicy Bypass -File "%~dp0install-core.ps1"

echo.
echo ===================================================
echo     SETUP COMPLETE! You're ready to go!
echo ===================================================
echo.
echo  To start: double-click start-portllm.bat
echo.
pause
