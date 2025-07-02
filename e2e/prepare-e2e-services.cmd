@echo off
cd e2e

docker-compose pull
docker-compose up -d

echo [92m*** Waiting for services... ***[0m
timeout /t 15 /nobreak >nul
echo.

:wait_contracts
echo [92m*** Waiting for contracts to be deployed... ***[0m
docker-compose exec boson-protocol-node ls /app/deploy.done 2>nul
if %ERRORLEVEL% EQU 0 (GOTO wait_subgraph)
REM Sleep for 15 Sec
timeout /t 15 /nobreak >nul
GOTO wait_contracts

:wait_subgraph
echo [92m*** Waiting for subgraph to be deployed... ***[0m
docker-compose exec boson-subgraph ls /home/deploy.done 2>nul
if %ERRORLEVEL% EQU 0 (GOTO ready)
REM Sleep for 15 Sec
timeout /t 15 /nobreak >nul
GOTO wait_subgraph

:ready
echo [92m*** Successfully deployed contracts and subgraph ***[0m
echo.
