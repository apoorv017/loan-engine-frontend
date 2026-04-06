@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\agrap\OneDrive\Desktop\Loan approval\loan-engine"

echo Staging changes...
git add -A

echo Committing changes...
git commit -m "Fix CORS allow all origins when no FRONTEND_URL configured"

echo Pushing to GitHub...
git push origin master

echo.
echo Done! Changes pushed. Render will auto-redeploy shortly.
pause
