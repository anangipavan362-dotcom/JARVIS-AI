#!/usr/bin/env bash
# ============================================================
# JARVIS AI — Google Cloud Run Automated Deployment Script
# ============================================================
set -e

echo "============================================================"
echo "🚀 J.A.R.V.I.S. AI — GOOGLE CLOUD RUN DEPLOYMENT SCRIPT"
echo "============================================================"

PROJECT_ID=$(gcloud config get-value project 2>/dev/null || true)

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    echo "⚠️  No project ID currently active in gcloud."
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "✓ Active Project ID: $PROJECT_ID"

echo ""
echo "🔧 Step 1: Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    --project "$PROJECT_ID"

echo ""
echo "📦 Step 2: Building and deploying backend container..."
gcloud run deploy jarvis-backend \
    --source ./backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars "PORT=8080,DATABASE_URL=sqlite:///./jarvis.db" \
    --project "$PROJECT_ID"

echo ""
echo "🔍 Step 3: Verifying live Cloud Run service..."
BACKEND_URL=$(gcloud run services describe jarvis-backend --platform managed --region us-central1 --project "$PROJECT_ID" --format 'value(status.url)')

echo "============================================================"
echo "🎉 CLOUD RUN DEPLOYMENT COMPLETE!"
echo "Live Backend HTTPS URL: $BACKEND_URL"
echo "Health Endpoint:        $BACKEND_URL/health"
echo "============================================================"
echo "Now provide this URL to deploy your React frontend to Firebase Hosting!"
