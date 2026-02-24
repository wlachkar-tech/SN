# Deployment Guide

## Table of Contents
1. [Development Environment](#development-environment)
2. [Production Deployment](#production-deployment)
3. [Heroku Deployment](#heroku-deployment)
4. [Vercel/Netlify Deployment](#vercelnetlify-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Security Checklist](#security-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Development Environment

### Local Setup

1. **Install Dependencies**
```bash
npm run install-all
```

2. **Configure Environment Variables**
```bash
# Backend
cd backend
cp .env.example .env

# Frontend
cd ../frontend
cp .env.local.example .env.local
```

3. **Start Development Servers**
```bash
cd ..
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## Production Deployment

### Backend Deployment (Express + SQLite)

#### Option 1: Self-Hosted VPS

1. **Prepare Server**
```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

2. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/your-repo/student-management.git
cd student-management/backend

# Install dependencies
npm install

# Create production .env
cat > .env << EOF
PORT=5000
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
EOF

# Start with PM2
pm2 start server.js --name "student-backend"

# Setup auto-restart
pm2 startup
pm2 save
```

3. **Setup Reverse Proxy (Nginx)**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

4. **Enable SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Option 2: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create your-app-name-api
```

3. **Configure Environment**
```bash
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **View Logs**
```bash
heroku logs --tail
```

#### Option 3: Railway

1. **Connect Repository**
   - Go to railway.app
   - Click "New Project"
   - Connect GitHub repo

2. **Configure Variables**
   - Add `JWT_SECRET`
   - Add `NODE_ENV=production`

3. **Deploy**
   - Select backend directory
   - Railway auto-deploys on push

#### Option 4: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean dashboard
   - Click "Create" → "App"
   - Connect GitHub repo

2. **Configure**
   - Set environment variables
   - Configure database

3. **Deploy**
   - Click "Deploy"

### Frontend Deployment (Next.js)

#### Option 1: Vercel (Recommended)

1. **Initialize Vercel**
```bash
cd frontend
npm install -g vercel
vercel
```

2. **Configure Environment**
   - During setup, add environment variables:
     - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
     - `NEXTAUTH_SECRET` (change to prod value)
     - `NEXTAUTH_URL=https://yourdomain.com`

3. **Deploy**
```bash
vercel --prod
```

#### Option 2: Netlify

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select repository

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables**
   - Dashboard → Site settings → Build & deploy → Environment
   - Add required variables

4. **Deploy**
   - Auto-deploys on push to main

#### Option 3: AWS Amplify

1. **Connect Repository**
```bash
npm install -g @aws-amplify/cli
amplify init
```

2. **Configure Build**
```bash
amplify add hosting
```

3. **Deploy**
```bash
amplify publish
```

#### Option 4: Self-Hosted

1. **Build Application**
```bash
cd frontend
npm run build
```

2. **Deploy to Server**
```bash
npm install -g pm2

# Create ecosystem.config.js
pm2 start server.js --name "student-frontend"

# Or use standalone mode
npm start
```

---

## Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000/api
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: http://localhost:3000
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
```

### Deploy with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Environment Configuration

### Production Environment Variables

#### Backend (.env)
```
NODE_ENV=production
PORT=5000
JWT_SECRET=<secure-random-32-chars>
DATABASE_URL=./students.db
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXTAUTH_SECRET=<secure-random-32-chars>
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_TRUST_HOST=true
```

### Generate Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

---

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
sudo apt install certbot

# Standalone
sudo certbot certonly --standalone -d yourdomain.com

# Nginx
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Database Backup & Restore

### Backup SQLite Database

```bash
# Backup
cp backend/students.db backend/students.db.backup

# Or with timestamp
cp backend/students.db backend/students.db.$(date +%Y%m%d_%H%M%S).backup

# Automated backup (cron)
0 2 * * * cp /app/backend/students.db /backups/students.db.$(date +\%Y\%m\%d).backup
```

### Restore Database

```bash
cp backend/students.db.backup backend/students.db
```

### Migrate to PostgreSQL (Production Recommended)

1. **Install PostgreSQL**
2. **Update database.js** to use PostgreSQL
3. **Run migrations**

---

## Monitoring & Logging

### Backend Logging

```bash
# View PM2 logs
pm2 logs student-backend

# Or use journalctl
journalctl -u student-backend -f
```

### Frontend Monitoring

```bash
# Vercel Analytics
# Automatically enabled on Vercel

# Netlify Analytics
# Configure in dashboard
```

### Health Checks

```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000
```

---

## Security Checklist

During deployment, verify:

- [ ] Change all default secrets and keys
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS correctly
- [ ] Set secure cookie flags
- [ ] Enable CSRF protection
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Remove debug logs in production
- [ ] Set up firewall rules
- [ ] Enable automatic backups
- [ ] Configure error monitoring (Sentry)
- [ ] Set up uptime monitoring
- [ ] Review security headers
- [ ] Enable security scanning
- [ ] Set up log aggregation

---

## Performance Optimization

### Backend
```bash
# Enable compression
npm install compression
```

Update server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

### Frontend
```bash
# Optimize images
npm install next-image-export-optimizer

# Analyze bundle
npm install @next/bundle-analyzer
```

---

## Troubleshooting

### Common Deployment Issues

**502 Bad Gateway**
- Check if backend is running
- Verify CORS configuration
- Check firewall rules

**Memory Issues**
- Increase Node.js memory: `node --max-old-space-size=4096`
- Use clustering for multiple processes

**Database Connection Errors**
- Ensure Database file permissions
- Check database path in .env
- Verify database exists

**SSL Certificate Issues**
- Ensure certificate is valid
- Check expiration date
- Verify domain name matches

---

## Monitoring Tools

### Recommended Services

- **Error Tracking**: Sentry
- **Performance**: New Relic, DataDog
- **Logging**: Papertrail, LogDNA
- **Uptime**: UptimeRobot, Pingdom
- **CDN**: Cloudflare, CloudFront

---

## Rollback Strategy

### Git-based Rollback

```bash
# View deployment history
git log --oneline

# Rollback to previous version
git revert <commit-hash>
git push

# For Vercel
vercel --prod
```

### Database Rollback

```bash
# Restore from backup
cp backup/students.db.old backend/students.db

# Restart service
pm2 restart student-backend
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Multiple backend instances
- Shared database

### Vertical Scaling
- Increase server resources
- Database indexing
- Query optimization

### Future Migrations
- Use PostgreSQL instead of SQLite
- Implement Redis caching
- Use message queues
- Microservices architecture

---

For production deployments, consult with your DevOps team and security specialists.
