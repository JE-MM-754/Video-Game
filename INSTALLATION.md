# Installation Guide - MetaForge Gaming Tools

This guide will help you set up MetaForge Gaming Tools for AI-powered gaming build optimization and meta analysis.

## Prerequisites

- **Node.js 18+** (LTS recommended)
- **Python 3.9+** (for AI backend services)
- **PostgreSQL 14+** (for build database)
- **Redis 6+** (for caching and real-time features)
- **Docker & Docker Compose** (optional but recommended)

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/metaforge-gaming-tools.git
cd metaforge-gaming-tools

# Copy and configure environment
cp .env.example .env.local
# Edit .env.local with your API keys (see Configuration section)

# Start all services
docker-compose up -d

# Initialize database and seed data
docker-compose exec api python scripts/init_db.py
docker-compose exec api python scripts/seed_gaming_data.py

# Access the application
# - Web App: http://localhost:3000
# - API: http://localhost:8000
# - Build Database Admin: http://localhost:8000/admin
```

### Option 2: Manual Installation

```bash
# Clone repository
git clone https://github.com/yourusername/metaforge-gaming-tools.git
cd metaforge-gaming-tools

# Install frontend dependencies
npm install

# Set up Python AI backend (optional for full features)
cd ai-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start development servers
npm run dev          # Frontend (port 3000)
cd ai-backend && python -m uvicorn main:app --reload --port 8000  # AI API
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Core Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# AI Services (required for full functionality)
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key

# Gaming APIs
STEAM_API_KEY=your-steam-web-api-key
REDDIT_CLIENT_ID=your-reddit-app-client-id
REDDIT_CLIENT_SECRET=your-reddit-app-secret

# Database
DATABASE_URL=postgresql://metaforge:password@localhost:5432/metaforge_gaming
REDIS_URL=redis://localhost:6379

# Optional Services
DISCORD_WEBHOOK_URL=your-discord-webhook-for-meta-alerts
ANALYTICS_ID=your-google-analytics-id
```

### API Keys Setup

#### OpenAI API Key
1. Visit [platform.openai.com](https://platform.openai.com/api-keys)
2. Create new API key with appropriate usage limits
3. Add billing method for production use

#### Steam Web API Key
1. Visit [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)
2. Register your domain (use `localhost` for development)
3. Copy the generated key

#### Reddit API Access
1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Create new "web app"
3. Note client ID and secret

## Database Setup

### PostgreSQL Installation

#### macOS (Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
createdb metaforge_gaming
```

#### Ubuntu/Debian
```bash
sudo apt-get install postgresql-14
sudo systemctl start postgresql
sudo -u postgres createdb metaforge_gaming
```

#### Docker (Alternative)
```bash
docker run -d \
  --name metaforge-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=metaforge_gaming \
  -p 5432:5432 \
  postgres:14-alpine
```

### Database Schema

```bash
# Apply migrations (if using AI backend)
cd ai-backend
python -m alembic upgrade head

# Or use the initialization script
python scripts/init_db.py
```

### Seed Gaming Data

```bash
# Load initial gaming data
python scripts/seed_gaming_data.py

# Import community builds (optional)
python scripts/import_builds.py data/builds/helldivers2-meta.json
python scripts/import_builds.py data/builds/borderlands4-meta.json
```

## AI Backend Setup (Optional)

The AI backend provides advanced features like build optimization and meta prediction. It's optional for basic functionality.

### Python Dependencies

```bash
cd ai-backend
python -m venv venv
source venv/bin/activate

# Core dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary
pip install openai anthropic redis celery
pip install pandas numpy scikit-learn
pip install beautifulsoup4 requests praw

# Development dependencies  
pip install pytest black isort flake8
pip install alembic
```

### Service Architecture

```
Frontend (Next.js) ←→ AI Backend (FastAPI) ←→ PostgreSQL
                                ↕
                              Redis (Cache + Jobs)
```

### Starting AI Services

```bash
# Main API server
cd ai-backend
uvicorn main:app --reload --port 8000

# Background worker (separate terminal)
celery -A worker.celery worker --loglevel=info

# Scheduler for periodic tasks (separate terminal)
celery -A worker.celery beat --loglevel=info
```

## Development Setup

### Frontend Development

```bash
# Start development server with hot reload
npm run dev

# Run type checking
npm run type-check

# Run tests
npm test

# Build for production
npm run build
```

### Code Quality Tools

```bash
# ESLint and Prettier (frontend)
npm run lint
npm run lint:fix

# Python linting (backend)
cd ai-backend
black . && isort . && flake8 .

# Run all tests
npm test && cd ai-backend && python -m pytest
```

### Git Hooks (Recommended)

```bash
# Install pre-commit hooks
npm install --save-dev husky lint-staged

# Set up pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

## Gaming Data Sources

### Automated Data Collection

The system can automatically collect gaming data from various sources:

```python
# Configure data sources in ai-backend/config/sources.py
GAMING_DATA_SOURCES = {
    "helldivers2": {
        "reddit_subreddits": ["Helldivers", "HelldiversGame"],
        "steam_app_id": "553850",
        "patch_notes_url": "https://store.steampowered.com/news/app/553850",
        "creator_channels": ["OhDough", "Moxsy", "ThiccFilA"]
    },
    "borderlands4": {
        "reddit_subreddits": ["borderlands4", "borderlands"],
        "steam_app_id": "2933390",
        "patch_notes_url": "https://store.steampowered.com/news/app/2933390"
    }
}
```

### Manual Data Import

```bash
# Import build data from JSON
python scripts/import_builds.py data/builds/custom-builds.json

# Import creator content
python scripts/import_creators.py data/creators/gaming-influencers.csv

# Import patch analysis
python scripts/import_patches.py data/patches/helldivers2-6.0.3.json
```

## Production Deployment

### Docker Production Setup

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production environment
ENVIRONMENT=production docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose exec api python -m alembic upgrade head
```

### Environment Configuration

```bash
# Production .env
ENVIRONMENT=production
NODE_ENV=production
DEBUG=false

# Security
SECRET_KEY=your-256-bit-secret-key
CORS_ORIGINS=https://metaforge.tools,https://app.metaforge.tools

# Database (managed service recommended)
DATABASE_URL=postgresql://user:pass@prod-db.cloud.com:5432/metaforge

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-new-relic-key
```

### SSL and Security

```bash
# Generate SSL certificates (Let's Encrypt)
certbot --nginx -d metaforge.tools -d api.metaforge.tools

# Configure nginx reverse proxy
upstream metaforge_frontend {
    server localhost:3000;
}

upstream metaforge_api {
    server localhost:8000;
}

server {
    listen 443 ssl;
    server_name metaforge.tools;
    
    location / {
        proxy_pass http://metaforge_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name api.metaforge.tools;
    
    location / {
        proxy_pass http://metaforge_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Platform-Specific Deployments

### Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel --prod

# Set environment variables in Vercel dashboard
# Point NEXT_PUBLIC_API_URL to your backend deployment
```

### Heroku (Full Stack)

```bash
# Install Heroku CLI
# Create new Heroku app
heroku create metaforge-gaming-tools

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Add Redis addon
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: metaforge-gaming-tools
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/metaforge-gaming-tools
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_API_URL
    value: ${api.PUBLIC_URL}
  
- name: api
  source_dir: /ai-backend
  github:
    repo: yourusername/metaforge-gaming-tools
    branch: main
  run_command: uvicorn main:app --host 0.0.0.0 --port 8080
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- engine: PG
  name: metaforge-db
  num_nodes: 1
  size: db-s-dev-database
```

## Testing

### Frontend Testing

```bash
# Unit tests with Jest
npm test

# Integration tests
npm run test:integration

# E2E tests with Playwright
npm run test:e2e

# Visual regression tests
npm run test:visual
```

### Backend Testing

```bash
cd ai-backend

# Unit tests
python -m pytest tests/unit/ -v

# Integration tests
python -m pytest tests/integration/ -v

# Load tests
python -m pytest tests/load/ -v

# Test coverage
python -m pytest --cov=app tests/
```

### Performance Testing

```bash
# Frontend performance audit
npm run lighthouse

# API load testing
cd ai-backend
locust -f tests/load/locustfile.py --host=http://localhost:8000

# Database performance testing
pgbench -i metaforge_gaming
pgbench -c 10 -j 2 -t 1000 metaforge_gaming
```

## Monitoring & Observability

### Application Monitoring

```bash
# Set up Sentry for error tracking
SENTRY_DSN=your-sentry-dsn

# Configure New Relic for performance monitoring
NEW_RELIC_LICENSE_KEY=your-license-key

# Set up health checks
curl http://localhost:3000/api/health
curl http://localhost:8000/health
```

### Logging Configuration

```javascript
// next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
}
```

```python
# ai-backend/core/logging.py
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

## Troubleshooting

### Common Issues

1. **Node.js version conflicts:**
   ```bash
   # Use nvm to manage Node versions
   nvm install 18
   nvm use 18
   ```

2. **Python dependency conflicts:**
   ```bash
   # Clear pip cache and reinstall
   pip cache purge
   pip install --no-cache-dir -r requirements.txt
   ```

3. **Database connection issues:**
   ```bash
   # Test PostgreSQL connection
   pg_isready -h localhost -p 5432
   
   # Check connection string format
   postgresql://[user[:password]@][host][:port][/dbname]
   ```

4. **API key rate limits:**
   - Monitor usage in provider dashboards
   - Implement exponential backoff
   - Set up usage alerts

### Performance Issues

1. **Slow build analysis:**
   - Check OpenAI API latency
   - Implement result caching
   - Use background processing for heavy computations

2. **Frontend performance:**
   ```bash
   # Analyze bundle size
   npm run analyze
   
   # Optimize images
   npm install next-optimized-images
   ```

3. **Database performance:**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_builds_game ON builds(game);
   CREATE INDEX idx_builds_tier ON builds(tier);
   CREATE INDEX idx_builds_success_rate ON builds(success_rate);
   ```

## Support

### Community Support
- **GitHub Discussions:** [Ask questions and share ideas](https://github.com/yourusername/metaforge-gaming-tools/discussions)
- **Discord Server:** Join our gaming developer community
- **Reddit:** r/MetaForgeTools for community discussions

### Professional Support
- **Email:** support@metaforge.tools
- **Enterprise:** enterprise@metaforge.tools for custom solutions
- **Bug Reports:** Use GitHub Issues with detailed reproduction steps

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and how to submit improvements.

---

**Next Steps:** 
- Check out [USAGE.md](docs/USAGE.md) for user guide
- See [API.md](docs/API.md) for integration documentation
- Review [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production best practices