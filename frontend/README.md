# GrandEdu Frontend

## Backend Connection Setup

This frontend is configured to connect to the backend API with automatic fallback between local development and production environments.

### Environment Variables

#### Local Development (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_PRODUCTION_API_URL=https://grandedu-g5yo.onrender.com
```

#### Production (`.env.production`)

```
NEXT_PUBLIC_API_URL=https://grandedu-g5yo.onrender.com
NEXT_PUBLIC_PRODUCTION_API_URL=https://grandedu-g5yo.onrender.com
```

### Backend URLs

- **Local Development**: `http://localhost:5001`
- **Production**: `https://grandedu-g5yo.onrender.com`

### How It Works

1. **Development Mode**:

   - Uses localhost:5001 by default
   - Falls back to production URL if localhost is unavailable

2. **Production Mode**:
   - Always uses the production URL: `https://grandedu-g5yo.onrender.com`

### API Endpoints

All API calls are centralized through `src/utils/api.ts`:

- Health Check: `/api/health`
- Authentication: `/api/auth/login`, `/api/auth/signup`
- Content Management: `/api/content/*`
- Programs: `/api/programs`

### Deployment

When deploying to Vercel:

1. The production environment variables are automatically used
2. All API calls will point to the production backend
3. No additional configuration needed

### Local Development

To run locally:

1. Start your local backend on port 5001
2. Run `npm run dev` or `yarn dev`
3. The frontend will automatically connect to localhost:5001
4. If localhost is not available, it will fallback to production

### Troubleshooting

If you encounter connection issues:

1. Check if your local backend is running on port 5001
2. Verify the production backend is accessible at https://grandedu-g5yo.onrender.com
3. Check browser console for any CORS or network errors
