Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "       TERRASCOPE — ENVIRONMENTAL TREND DISCOVERY PLATFORM           " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Strict Data Provenance Policy: Exclusively Approved Sources:" -ForegroundColor Yellow
Write-Host "  1. NASA Giovanni (https://giovanni.gsfc.nasa.gov/giovanni/)"
Write-Host "  2. NASA Hydrology Time Series (GES DISC Hydrology Data Rods)"
Write-Host "  3. NASA AppEEARS (https://appeears.earthdatacloud.nasa.gov/)"
Write-Host "  4. NOAA Climate Data Online (CDO) (https://www.ncei.noaa.gov/cdo-web/)"
Write-Host "  5. KNMI Climate Explorer (https://climexp.knmi.nl/)"
Write-Host "  6. CSA RADARSAT Constellation Mission (RCM) (https://www.asc-csa.gc.ca/)"
Write-Host ""
Write-Host "Starting integrated application server on http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "Access dashboard directly in your browser at: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the platform."
Write-Host "=====================================================================" -ForegroundColor Cyan

& ".\.venv\Scripts\python.exe" backend\run.py
