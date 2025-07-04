@echo off
call "%~dp0\prepare-e2e-services.cmd"

echo [92m*** Run e2e tests... ***[0m
cd ..
call npm run e2e:test -- --no-cache
set EXIT_STATUS=%ERRORLEVEL%

cd e2e
docker-compose down -v
cd ..
exit %EXIT_STATUS%