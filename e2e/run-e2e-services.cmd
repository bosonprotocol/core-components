@echo off
cd e2e

docker-compose up -d

echo [92m*** Waiting for services... ***[0m
timeout /t 15 /nobreak >nul
echo.

echo [92m*** Deploying contracts... ***[0m
docker-compose exec hardhat-node npm run deploy
if %ERRORLEVEL% NEQ 0 (
  echo Contracts couldn't be deployed
  exit /B 1
)
echo [92m*** Successfully deployed contracts ***[0m
echo.

echo [92m*** Deploying subgraph... ***[0m
call npm run subgraph:deploy:local
if %ERRORLEVEL% NEQ 0 (
  echo Subgraph couldn't be deployed
  exit /B 1
)
echo [92m*** Successfully deployed subgraph ***[0m
echo.

set /p DUMMY=*** Press any key to shutdown services ***
docker-compose down -v
rmdir /S /Q .\data
cd ..