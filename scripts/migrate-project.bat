@echo off
REM Windows Batch Script for Project Migration to "Orbit and Chill"
REM Usage: migrate-project.bat [destination-path] [git-repo-url]

echo.
echo 🚀 Starting Project Migration to "Orbit and Chill" (Windows)...
echo.

REM Pass all arguments to the Node.js script
if "%~2"=="" (
    if "%~1"=="" (
        node scripts/migrate-project.js
    ) else (
        node scripts/migrate-project.js "%~1"
    )
) else (
    node scripts/migrate-project.js "%~1" "%~2"
)