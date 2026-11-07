@echo off
chcp 65001 >nul
title PG HOME LUXURY - HE THONG QUAN TRI NOI BO
echo ============================================================
echo   KHOI DONG SERVER QUAN TRI PG HOME LUXURY (PORT 8080)
echo ============================================================
start "" "http://localhost:8080/index.html"
python -u "%~dp0web_app\server.py" 8080
pause

