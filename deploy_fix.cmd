@echo off
REM Navigate to backend and commit
cd /d "c:\Users\agrap\OneDrive\Desktop\Loan approval\loan-engine\backend"
git add server.js
git commit -m "Fix CORS origin validation for production"

REM Go back to main repo
cd ..
git add -A
git commit -m "Update backend CORS fix"

REM Push
git push origin master

echo.
echo Deploy should start on Render now. Check the logs.
pause
