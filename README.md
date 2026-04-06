# Loan Approval Project

## Overview

This repository contains a loan approval application with two parts:

- `backend/` - Node.js + Express API for loan evaluation
- `loan-engine/frontend/` - React + Vite frontend for submitting loan applications

The frontend sends a POST request to the backend `/evaluate` endpoint and displays the returned `decision` and `reason`.

## Backend Architecture

The backend is an Express server in `backend/server.js`.

Key behavior:

- Uses `cors` and `dotenv`
- Loads rules from `backend/engine/rules.json`
- Evaluates conditions dynamically using `backend/engine/conditionEvaluator.js`
- Exposes the loan evaluation endpoint at:
  - `POST /evaluate`
- Supports API route namespace at:
  - `POST /api/evaluate`

Important backend files:

- `backend/server.js`
- `backend/routes/index.js`
- `backend/engine/evaluateLoan.js`
- `backend/engine/rules.json`
- `backend/engine/conditionEvaluator.js`
- `backend/.env`

## Frontend Architecture

The frontend is a Vite React app located in `loan-engine/frontend/`.

Key files:

- `loan-engine/frontend/src/App.tsx` - main loan application form
- `loan-engine/frontend/src/style.css` - app styling
- `loan-engine/frontend/vite.config.ts` - Vite config for local dev proxy
- `loan-engine/frontend/.env.production` - production env placeholder
- `loan-engine/frontend/.env.development` - local dev env settings

The frontend uses the environment variable `VITE_API_URL` to configure the backend API URL.
If the env variable is not available it falls back to:

- `http://localhost:5000` for local development
- `https://loan-engine-backend.onrender.com` as a default production backend URL

The request path is:

- `POST ${API_URL}/evaluate`

## Deployment Flow

### Backend

- Intended deployment platform: Render
- Backend should be configured with:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `FRONTEND_URL=https://loan-engine-frontend-7g2t4juev-apoorvs-projects-add122e7.vercel.app`

### Frontend

- Intended deployment platform: Vercel
- Vercel environment variable should be:
  - `VITE_API_URL=https://loan-engine-backend.onrender.com`

## Current Known Issue

### Symptom

After deployment, the frontend on Vercel shows the error:

- `Unable to connect to the loan server.`

### Probable cause

The frontend is not correctly reaching the Render backend because of one or more deployment issues:

- Vercel may not have the correct `VITE_API_URL` value set in environment variables
- The build deployed on Vercel may still be using an older value if the service was not redeployed after env changes
- Render may have incorrect backend environment variables
- The frontend deployed on Vercel may still be trying to use a local URL if the env variable is missing

### What to check

1. Confirm `VITE_API_URL` in Vercel is exactly:
   - `https://loan-engine-backend.onrender.com`
2. Confirm Vercel has redeployed after the env var update
3. Confirm Render backend has `FRONTEND_URL` set to the exact Vercel frontend URL
4. Confirm Render backend logs show startup with `NODE_ENV=production`
5. Confirm the backend URL is accessible by testing:
   - `POST https://loan-engine-backend.onrender.com/evaluate`

## Common Issues

### ❌ Port already in use
If you get "port 5000 already in use" when starting the backend:

```bash
npx kill-port 5000
```

### ❌ Node not recognized
If `node` or `npm` commands are not recognized:

- Restart your system after installing Node.js
- Ensure Node.js is added to your PATH during installation

### ❌ CORS error
If you encounter CORS errors in development:

The backend already includes `app.use(cors())` in `backend/server.js`, but if you're still getting errors, ensure the CORS configuration matches your frontend origin.

For production, verify the `FRONTEND_URL` or `ALLOWED_ORIGINS` environment variables are set correctly in Render.

## How an AI model should use this file


An AI model reading this README should be able to:

- understand the two-part architecture and where code lives
- update the frontend API URL environment configuration
- modify backend CORS configuration if needed
- debug why Vercel/Render deployment is not currently connected
- locate the loan evaluation endpoint and rules engine
- make edits to fix the connection problem

## Recommended next steps

1. Ensure the backend repo is deployed on Render and the service URL is valid.
2. Ensure the frontend repo is deployed on Vercel with `VITE_API_URL` pointing to the Render URL.
3. Redeploy Vercel after updating the env var.
4. If the frontend still fails, inspect the browser Network tab for the exact fetch request and error.

## Notes

- The root repository contains a non-deployable `package.json` but the actual app code is in the `backend/` and `loan-engine/frontend/` folders.
- The backend currently reads rules from JSON and evaluates them dynamically, which is central to loan decision logic.
