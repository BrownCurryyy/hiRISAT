# Railway to Render Backend Migration Guide

This document outlines the steps to migrate your hiRISAT backend from Railway to Render.

## What's Changed

1. **Backend Configuration**: Added `render.yaml` for Render-specific deployment configuration
2. **Frontend Rewrites**: Updated `vercel.json` to point to the new Render backend URL
3. **Port Handling**: Updated `app.py` to properly handle the `PORT` environment variable that Render sets

## Deployment Steps

### Step 1: Prepare the Backend Repository

Your backend is already configured for Render. The key files are:
- `Procfile` - Specifies the web process (Render reads this)
- `render.yaml` - Render-specific configuration
- `requirements.txt` - Python dependencies
- `app.py` - Main FastAPI application with environment variable support

### Step 2: Create a New Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository (select the repository containing your backend code)
4. Configure the service:
   - **Name**: `hirisat-backend` (or your preferred name)
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app`
   - **Instance Type**: Free or Starter (adjust based on needs)

5. Click **"Create Web Service"**
6. Wait for the deployment to complete and note your service URL (e.g., `https://hirisat-backend.onrender.com`)

### Step 3: Update Frontend Configuration

Once your Render backend is deployed, update the Vercel configuration:

1. Open `frontend/vercel.json`
2. Replace the placeholder URL with your actual Render backend URL:

```json
{
    "rewrites": [
        {
            "source": "/api/:path*",
            "destination": "https://YOUR-RENDER-APP-NAME.onrender.com/:path*"
        },
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}
```

3. Push the changes to GitHub
4. Vercel will automatically redeploy the frontend

### Step 4: Test the Integration

1. Visit your Vercel frontend URL
2. Test the satellite pass calculations to ensure the backend is connected
3. Check the browser console for any CORS or connection errors

## Important Notes

- **Cold Start**: Render's free tier has a cold start delay. Services spin down after 15 minutes of inactivity.
- **Environment Variables**: If you need environment variables (API keys, etc.), add them in the Render dashboard under **Environment**
- **Automatic Deploys**: Render watches your GitHub branch and automatically deploys on new commits
- **CORS**: The backend allows all origins (`allow_origins=["*"]`). Consider restricting this in production.

## Troubleshooting

### Backend not responding
- Check Render dashboard logs for deployment/runtime errors
- Verify the service URL is correct in `vercel.json`
- Check CORS headers and network requests in browser DevTools

### Cold start issues
- Render free tier services spin down after inactivity
- Upgrade to a paid tier for always-on service

### Port errors
- Render automatically assigns a PORT. The `app.py` changes handle this correctly
- Check that `PORT` environment variable is being respected

## Reverting to Railway

If you need to revert:
1. Update `vercel.json` with your Railway backend URL
2. Push changes to trigger Vercel redeploy

## Additional Resources

- [Render Docs](https://render.com/docs)
- [FastAPI with Render](https://render.com/docs/deploy-fastapi)
- [Gunicorn with Uvicorn Workers](https://docs.gunicorn.org/en/latest/design.html#async-workers)
