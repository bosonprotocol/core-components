@echo off
call "%~dp0\prepare-e2e-services.cmd"

set /p DUMMY=*** Press any key to shutdown services ***
docker-compose down -v
rmdir /S /Q .\data
cd ..