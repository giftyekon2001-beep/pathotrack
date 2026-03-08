# PathoTrack Deployment Guide

This guide covers deploying PathoTrack to various environments.

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git

### Setup

1. Clone repository:
```bash
git clone <repository-url>
cd pathotrack
```

2. Install dependencies:
```bash
npm install
cd backend && npm install && cd ..
```

3. Configure environment:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-development-secret-key
DATABASE_PATH=./database.db
```

4. Start development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Quick Start

1. Build and run:
```bash
docker-compose up -d
```

2. Access application:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

3. View logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

4. Stop services:
```bash
docker-compose down
```

### Configuration

Edit `docker-compose.yml` to customize:
- Port mappings
- Environment variables
- Volume mounts
- Resource limits

## Cloud Deployment

### AWS EC2 Deployment

1. Launch EC2 instance:
   - Ubuntu 22.04 LTS
   - t2.medium or larger
   - Security group: allow ports 80, 443, 3000

2. Connect to instance:
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
```

4. Clone and deploy:
```bash
git clone <repository-url>
cd pathotrack
docker-compose up -d
```

5. Setup reverse proxy (Nginx):
```bash
sudo apt update
sudo apt install nginx
```

Create `/etc/nginx/sites-available/pathotrack`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/pathotrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. Setup SSL (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Heroku Deployment

1. Create Heroku account and install CLI

2. Create app:
```bash
heroku create pathotrack-app
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-production-secret
heroku config:set NODE_ENV=production
```

4. Deploy:
```bash
git push heroku main
```

### DigitalOcean App Platform

1. Connect GitHub repository

2. Configure build settings:
   - Build command: `npm install && npm run build`
   - Run command: `cd backend && npm start`

3. Set environment variables in dashboard

4. Deploy

### Azure Container Instances

1. Build and push Docker image:
```bash
az acr build --registry <registry-name> --image pathotrack:latest .
```

2. Deploy container:
```bash
az container create \
  --resource-group <group> \
  --name pathotrack \
  --image <registry>.azurecr.io/pathotrack:latest \
  --cpu 2 \
  --memory 4 \
  --ports 3000 80
```

## Production Configuration

### Environment Variables

Create production `.env`:
```
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-strong-random-key>
JWT_EXPIRE=7d
DATABASE_PATH=/data/database.db
LOG_LEVEL=info
```

Generate strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Backup

Create backup script `/scripts/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
cp database.db "$BACKUP_DIR/database_$DATE.db"
# Keep last 30 days
find $BACKUP_DIR -name "database_*.db" -mtime +30 -delete
```

Schedule with cron:
```bash
0 2 * * * /scripts/backup-db.sh
```

### Monitoring

#### Health Checks
```bash
curl http://localhost:3000/api/health
```

#### Logging
Configure centralized logging:
```javascript
// Add to server.js
const fs = require('fs');
const logStream = fs.createWriteStream('app.log', { flags: 'a' });
```

#### Performance Monitoring
- Use New Relic or DataDog
- Monitor response times
- Track error rates
- Monitor database performance

### Security Hardening

1. Update dependencies:
```bash
npm audit
npm audit fix
```

2. Enable HTTPS:
- Use SSL certificates
- Redirect HTTP to HTTPS
- Set HSTS headers

3. Rate limiting:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

4. CORS configuration:
```javascript
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}));
```

5. Security headers:
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## Scaling Strategies

### Horizontal Scaling

1. Load balancer setup:
   - Use AWS ELB or Nginx
   - Route traffic across multiple instances
   - Session management strategy

2. Database replication:
   - Consider PostgreSQL with replication
   - Implement read replicas

3. Caching:
   - Implement Redis for sessions
   - Cache API responses

### Vertical Scaling

1. Increase instance resources:
   - More CPU cores
   - More RAM
   - Better storage

2. Database optimization:
   - Add indexes
   - Query optimization
   - Connection pooling

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update
npm audit

# Push updates
git add package*.json
git commit -m "Update dependencies"
git push origin main

# Redeploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Maintenance

```bash
# SQLite optimization
sqlite3 database.db "VACUUM;"
sqlite3 database.db "ANALYZE;"
```

### Logs Rotation

```bash
# Setup logrotate
sudo tee /etc/logrotate.d/pathotrack > /dev/null <<EOF
/var/log/pathotrack/*.log {
  daily
  rotate 7
  compress
  delaycompress
  notifempty
  create 0640 root root
  sharedscripts
}
EOF
```

## Troubleshooting

### Backend not starting
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
echo $JWT_SECRET

# Test database connection
sqlite3 backend/database.db ".tables"
```

### Frontend not connecting to API
```bash
# Check API URL in vite.config.js
# Verify CORS is enabled
# Check browser console for errors
```

### High memory usage
```bash
# Check process memory
docker stats

# Restart services
docker-compose restart
```

### Database is full
```bash
# Check disk usage
df -h

# Archive old data
sqlite3 database.db "DELETE FROM symptom_reports WHERE createdAt < datetime('now', '-90 days');"
```

## Performance Tuning

### Frontend Optimization
- Enable code splitting
- Optimize images
- Minify CSS/JS
- Use CDN for static assets

### Backend Optimization
- Add database indexes
- Implement query caching
- Use connection pooling
- Compress responses

### Network Optimization
- Enable gzip compression
- Minimize API calls
- Implement pagination
- Cache aggressive

## Disaster Recovery

### Backup Strategy

1. Database backups:
   - Daily automated backups
   - Off-site replication
   - Regular restore tests

2. Code backups:
   - Git repository
   - Multiple remote origins
   - Release tags

3. Configuration backups:
   - Environment files
   - SSL certificates
   - Configuration files

### Recovery Procedures

```bash
# Restore database
cp /backups/database_20240115.db database.db

# Restore code
git checkout backup-tag

# Verify system
curl http://localhost:3000/api/health
```

## Support & Contact

For deployment assistance:
- Review Docker documentation
- Check cloud provider guides
- Create GitHub issues for problems