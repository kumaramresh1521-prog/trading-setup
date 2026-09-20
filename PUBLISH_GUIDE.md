# 🚀 Breadth Lab - Cloud Publishing & Deployment Guide

Is project ko internet par live publish karne ke liye sabhi jaruri files configure kar di gayi hain:
- ✅ **`Dockerfile`** (Python 3.11 optimized container)
- ✅ **`.dockerignore` & `.gcloudignore`** (Fast build, secret protection)
- ✅ **`deploy_to_gcp.sh`** (1-click script for Linux / Cloud Shell)
- ✅ **`deploy_to_gcp.bat`** (1-click script for Windows)
- ✅ **`cloudbuild.yaml`** (Google Cloud Build automated CI/CD)
- ✅ **Git Repository Initialized** (`master` branch clean commit)

---

## 🌟 Option A: Google Cloud Run (Sabse Best & Recommended)

### Tareeqa 1: Google Cloud Shell se (Sabse Aasan & Direct)

1. [Google Cloud Console](https://console.cloud.google.com/) me jayein.
2. Top bar me **Cloud Shell** icon (`>_`) par click karein.
3. Apna project Cloud Shell me upload karein ya GitHub se clone karein:
   ```bash
   git clone <AAPKA_GITHUB_REPO_URL>
   cd "app breadth 2"
   ```
4. Sirf ye command chalayein:
   ```bash
   chmod +x deploy_to_gcp.sh
   ./deploy_to_gcp.sh
   ```
   *(Ya direct: `gcloud run deploy breadth-lab --source . --region asia-south1 --allow-unauthenticated --port 8000 --memory 1Gi --cpu 1`)*
5. 2 minute me aapko live secure URL mil jayega:
   👉 `https://breadth-lab-xxxxxx-el.a.run.app`

---

### Tareeqa 2: GitHub + Google Cloud Run (Automated Deployment)

1. Apne GitHub account par ek new repository banayein (e.g. `breadth-lab`).
2. Apne computer ke terminal me ye commands run karein:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<AAPKA_USERNAME>/breadth-lab.git
   git push -u origin main
   ```
3. Google Cloud Console me **Cloud Run** ➔ **Create Service** par click karein:
   - Choose: **Continuously deploy from a repository**.
   - Apni GitHub repository select karein.
   - Build Type: **Dockerfile** (already configured).
   - Region: `asia-south1 (Mumbai)`.
   - Authentication: **Allow unauthenticated invocations**.
4. **Save & Deploy** par click karein. Ab jab bhi aap code push karenge, Google Cloud automatically use live update kar dega!

---

## 🌐 Option B: Render.com / Railway.app (Free & Zero-Config)

Agar aap bina GCP configuration ke 1-minute me live karna chahte hain:

1. [Render.com](https://render.com/) ya [Railway.app](https://railway.app/) par login karein (GitHub se).
2. **New Web Service** ➔ Select your GitHub Repository.
3. Environment: **Docker**.
4. Click **Deploy Web Service**.
5. Done! Free SSL aur live domain turant generate ho jayega.
