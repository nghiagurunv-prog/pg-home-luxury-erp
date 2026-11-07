@echo off
chcp 65001 >nul
echo ========================================================
echo   PG HOME LUXURY - HE THONG QUAN TRI CCSC 2026
echo ========================================================
echo Đang khởi động hệ thống quản trị...
start http://localhost:8080
cd /d "f:\PG Home - Quản trị\web_app"
python -m http.server 8080
pause
