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
netstat -ano | findstr ":8080" | findstr "LISTENING" >nul
if %errorlevel% neq 0 (
    echo [*] Đang khởi chạy Server Quản trị PG Home (server.py) trên cổng 8080...
    start "" /B python "%~dp0web_app\server.py"
    ping 127.0.0.1 -n 3 >nul
) else (
    echo [*] Server Quản trị PG Home đã đang chạy trên cổng 8080.
)

echo [*] Mở giao diện hệ thống quản trị trên trình duyệt...
start "" "http://localhost:8080"
echo.
echo ======================================================================
echo   HỆ THỐNG ĐÃ SẴN SÀNG VẬN HÀNH TẠI: http://localhost:8080
echo ======================================================================
echo.
pause
