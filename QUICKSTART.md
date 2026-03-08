# PathoTrack - Quick Start Guide

Get PathoTrack running in minutes!

## 🚀 Option 1: Docker (Recommended - 1 minute)

### Prerequisites
- Docker installed
- Docker Compose installed

### Commands
```bash
# Clone or navigate to project directory
cd pathotrack

# Start everything
docker-compose up -d

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

**Done!** ✅

---

## 💻 Option 2: Local Development (5 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn installed

### Step 1: Install Dependencies
```bash
# Root directory
npm install

# Backend
cd backend
npm install
cd ..
```

### Step 2: Configure Backend
```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env (optional - defaults work fine)
# PORT=3000
# JWT_SECRET=your-secret-key
# DATABASE_PATH=./database.db
```

### Step 3: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Backend running on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend running on http://localhost:5173
```

### Step 4: Access Application
- Open http://localhost:5173 in your browser

**Done!** ✅

---

## 📝 First Steps

### 1. Create Account
- Click "Sign Up"
- Choose account type:
  - **Community Member**: Report symptoms, find labs
  - **Laboratory Staff**: Upload test results
  - **Public Health Officer**: Monitor outbreaks
- Fill form and register

### 2. Try Symptom Checker
- Click "Symptom Checker" (no login required)
- Select symptoms: Fever, Cough, Diarrhea
- Click "Check Symptoms"
- See possible infections and confidence levels

### 3. Report Your Symptoms
- Login to your account
- Click "Report Symptoms"
- Select symptoms, location, severity
- Submit report
- View your reports in "My Symptoms"

### 4. Find Laboratories
- Click "Find Labs"
- See all laboratories or search nearby
- View contact details and directions
- Call or visit for testing

### 5. View Outbreaks
- Click "Outbreaks" (public data)
- See active outbreak alerts by location
- View disease trends
- Access health information

### 6. Health Education
- Click "Education"
- Read health tips by category
- Learn prevention methods
- Share with community

---

## 🧪 Test Data

Default sample data:
- **Symptoms**: Fever, Cough, Diarrhea, Rash, etc.
- **Infections**: Typhoid, Cholera, Malaria, TB, etc.
- **Education**: 10+ health topics
- **Labs**: Sample laboratories (add your own)

---

## 🔐 Demo Credentials

Create your own account or use test data:

**Test Community User:**
- Email: user@example.com
- Password: password123
- Role: Community

**Test Lab User:**
- Email: lab@example.com
- Password: password123
- Role: Laboratory

---

## 📱 Mobile View

All pages are fully responsive:
- Try resizing your browser (360px - 4K)
- Or open on mobile phone
- Menu adapts to screen size

---

## 🛠️ Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
npm start
```

### Frontend not connecting?
Check that backend is running:
```bash
curl http://localhost:3000/api/health
```

### Port already in use?
```bash
# Change in backend/.env
PORT=3001

# Or kill process:
lsof -ti:3000 | xargs kill -9
```

### Database error?
```bash
# Delete and recreate
rm backend/database.db
npm start
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| README.md | Full project overview |
| API_REFERENCE.md | API documentation |
| DEPLOYMENT.md | Production deployment |
| PROJECT_SUMMARY.md | Project completion |

---

## 🚢 Deploy to Production

### Option A: Docker
```bash
docker build -t pathotrack .
docker run -p 3000:3000 pathotrack
```

### Option B: Heroku
```bash
heroku create pathotrack-app
git push heroku main
```

### Option C: Your Server
See DEPLOYMENT.md for detailed guides

---

## 📊 Key Features

| Feature | Access |
|---------|--------|
| Symptom Checker | Home page (no login) |
| Report Symptoms | Login required |
| Find Labs | Available for all users |
| Outbreak Map | Public view |
| Education | Available for all users |
| Admin Panel | Admin role only |

---

## 🔗 API Quick Reference

```bash
# Health check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "community"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Check symptoms
curl -X POST http://localhost:3000/api/symptoms/check \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["Fever", "Cough"]}'

# Get labs
curl http://localhost:3000/api/laboratories/all

# Get outbreaks
curl http://localhost:3000/api/outbreaks/alerts
```

---

## 📈 Next Steps

1. **Explore UI**: Test all features
2. **Review Code**: Understand architecture
3. **Customize**: Add your own data
4. **Deploy**: Choose hosting platform
5. **Scale**: Plan for growth

---

## ✨ Pro Tips

- Use Postman to test APIs
- Check browser console (F12) for errors
- Enable geolocation for better UX
- Test on mobile for responsive design
- Review API docs for all endpoints

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Blank page | Check console for errors |
| API not responding | Verify backend is running |
| Database error | Delete database.db and restart |
| CORS error | Check API URL configuration |
| Form not submitting | Check required fields |

---

## 📞 Need Help?

1. Check README.md
2. Review DEPLOYMENT.md
3. See API_REFERENCE.md
4. Check browser console
5. Review backend logs

---

## 🎉 You're Ready!

PathoTrack is now running. Start exploring:
- Test the symptom checker
- Create an account
- Report symptoms
- Find laboratories
- View health education
- Monitor outbreaks

**Happy coding!** 🚀

---

*For detailed information, see README.md*