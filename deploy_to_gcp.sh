#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "🚀 Deploying Breadth Lab to Google Cloud Run"
echo "=========================================================="

SERVICE_NAME="breadth-lab"
REGION="asia-south1"

echo "Building and deploying to region: ${REGION}..."

gcloud run deploy ${SERVICE_NAME} \
  --source . \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

echo ""
echo "✅ Deployment completed successfully!"
