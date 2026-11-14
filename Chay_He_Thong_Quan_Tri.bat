@echo off
chcp 65001 >nul
cd /d "%~dp0"
title PG HOME LUXURY - HE THONG QUAN TRI CCSC 2026

echo ======================================================================
echo   CÔNG TY CP PHÚ GIA VIỆT NAM - PG HOME LUXURY
echo   HỆ THỐNG QUẢN TRỊ TOÀN DIỆN CCSC 2026
echo   Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
echo   Hotline: 0986.722.324 ^| MST: 042203002931
echo ======================================================================
echo.
echo [*] Đang kiểm tra cổng dịch vụ 8080...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/api/health' -TimeoutSec 1 -UseBasicParsing; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Đang khởi chạy Server Quản trị PG Home ngầm (pythonw.exe)...
    start "" pythonw.exe "%~dp0web_app\server.py"
    echo [*] Đang chờ server phản hồi (tối đa 5 giây)...
    powershell -NoProfile -Command "$ready = $false; for ($i=0; $i -lt 10; $i++) { Start-Sleep -Milliseconds 500; try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8080/api/health' -TimeoutSec 1 -UseBasicParsing; if ($r.StatusCode -eq 200) { $ready = $true; break } } catch {} }; if (-not $ready) { exit 1 }" >nul 2>&1
) else (
    echo [*] Server Quản trị PG Home đã đang chạy trên cổng 8080.
)

echo [*] Mở giao diện hệ thống quản trị trên trình duyệt...
start "" "http://127.0.0.1:8080/director"
echo.
echo ======================================================================
echo   HỆ THỐNG ĐÃ SẴN SÀNG VẬN HÀNH TẠI: http://127.0.0.1:8080/director
echo ======================================================================
echo.
timeout /t 3 >nul
