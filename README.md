# SafetyC Project

A full-stack application with React frontend and Node.js/Express backend.

## Deployment Instructions for Render

### Prerequisites

1. Create a [Render](https://render.com) account if you don't have one
2. Have your MongoDB connection string ready (from MongoDB Atlas or another MongoDB provider)

### Deployment Steps

1. Fork or push this repository to your GitHub account
2. Log in to your Render account
3. Click on the "New +" button and select "Blueprint"
4. Connect your GitHub account if you haven't already
5. Select the repository containing this project
6. Render will automatically detect the `render.yaml` file and configure your services
7. Configure the required environment variables:
   - Set `MONGO_URI` to your MongoDB connection string in the SafetyC API service
8. Click "Create Blueprint"
9. Wait for the deployment to complete

### Environment Variables

The following environment variables are required for deployment:

#### Backend Service
- `NODE_ENV`: Set to `production` for deployment
- `PORT`: Automatically set by Render
- `MONGO_URI`: Your MongoDB connection URI (must be set manually)
- `ALLOWED_ORIGINS`: Automatically set to your frontend URL

#### Frontend Service
- `VITE_API_URL`: Automatically set to your backend API URL

### Accessing Your Deployed Application

Once deployed, your application will be available at:

- Frontend: `https://safetyc-web.onrender.com`
- Backend API: `https://safetyc-api.onrender.com`

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Technologies Used

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Deployment: Render