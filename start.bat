@echo off
chcp 65001 >nul
setlocal
REM ============================================================
REM  Circuit Aurora 个人网站 一键启动
REM  端口 4173（与 AI 聊天系统的 8000 完全不冲突）
REM ============================================================
set "ROOT=%~dp0"
set "PORT=4173"

echo ==========================================
echo   边伟的个人网站
echo   站点 : http://localhost:%PORT%
echo   后台 : http://localhost:%PORT%/admin.html
echo ==========================================
echo.

REM ---- 端口占用检查：只判断 4173 本身 ----
netstat -ano | findstr /C:":%PORT% " | findstr LISTENING >nul 2>&1
if not errorlevel 1 (
  echo [提示] 端口 %PORT% 已在监听，网站可能已经在运行。
  echo        直接打开 http://localhost:%PORT%/
  start "" http://localhost:%PORT%/
  echo.
  echo        要重启请先关掉旧窗口，或执行： taskkill /F /IM node.exe
  pause
  exit /b 0
)

REM ---- 依赖检查 ----
if not exist "%ROOT%node_modules" (
  echo [首次运行] 正在安装依赖，请稍候...
  call npm install
  if errorlevel 1 (
    echo [错误] 依赖安装失败，请检查网络。
    pause
    exit /b 1
  )
)

echo [启动中] 构建并启动服务...
echo [提示] 保持此窗口开启，关闭窗口即停止服务。
echo.

start "" cmd /c "timeout /t 8 >nul & start http://localhost:%PORT%/"
call npm start

echo.
echo [服务已停止]
pause
endlocal