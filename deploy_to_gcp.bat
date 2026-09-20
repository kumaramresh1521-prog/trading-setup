@echo off
echo ==========================================================
echo  Deploying Breadth Lab to Google Cloud Run
echo ==========================================================

set SERVICE_NAME=breadth-lab
set REGION=asia-south1

echo Building and deploying to region: %REGION%...

gcloud run deploy %SERVICE_NAME% --source . --region %REGION% --allow-unauthenticated --port 8000 --memory 1Gi --cpu 1

if %ERRORLEVEL% equ 0 (
    echo.
    echo Deployment completed successfully!
) else (
    echo.
    echo Deployment failed. Please check your gcloud authentication and project configuration.
)

pause
