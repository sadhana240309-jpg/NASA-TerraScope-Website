@echo off
TITLE TerraScope Platform Server
echo =====================================================================
echo           TERRASCOPE ENVIRONMENTAL TREND DISCOVERY PLATFORM
echo =====================================================================
echo.
echo Strict Data Provenance Policy:
echo [1] NASA Giovanni
echo [2] NASA Hydrology Time Series
echo [3] NASA AppEEARS
echo [4] NOAA Climate Data Online (CDO)
echo [5] KNMI Climate Explorer
echo [6] Canadian Space Agency (CSA) - RADARSAT Constellation Mission (RCM)
echo.
echo Starting backend server on http://127.0.0.1:8000 ...
echo Press Ctrl+C to terminate.
echo =====================================================================

.\.venv\Scripts\python.exe backend\run.py
pause
