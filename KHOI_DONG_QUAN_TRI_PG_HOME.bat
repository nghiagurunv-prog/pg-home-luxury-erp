@echo off
chcp 65001 >nul
cd /d "%~dp0"
title PG HOME LUXURY - HE THONG QUAN TRI NOI BO
echo ============================================================
echo   KHOI DONG SERVER QUAN TRI PG HOME LUXURY (PORT 8080)
echo ============================================================
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/api/health' -TimeoutSec 1 -UseBasicParsing; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Khoi chay server ngam qua pythonw.exe...
    start "" pythonw.exe "%~dp0web_app\server.py"
    echo [*] Cho server khoi dong va phan hoi (toi da 5s)...
    powershell -NoProfile -Command "$ready = $false; for ($i=0; $i -lt 10; $i++) { Start-Sleep -Milliseconds 500; try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/api/health' -TimeoutSec 1 -UseBasicParsing; if ($r.StatusCode -eq 200) { $ready = $true; break } } catch {} }; if (-not $ready) { exit 1 }" >nul 2>&1
) else (
    echo [*] Server da dang chay tren cong 8080.
)
echo [*] Mo giao dien Giam Doc...
start "" "http://127.0.0.1:8080/director"
timeout /t 3 >nul


