# PathoTrack - Community Infection Detection Platform

A production-ready full-stack web application for community-driven infection detection and reporting. PathoTrack helps identify infectious disease trends early through symptom reporting and laboratory result tracking.

## 🎯 Features

### Core Features
- **Symptom Checker**: AI-powered symptom analysis with infection suggestions
- **Symptom Reporting**: Anonymous community symptom submission with location tracking
- **Lab Result Upload**: Secure upload of diagnostic test results
- **Laboratory Finder**: Locate nearby testing facilities with directions
- **Outbreak Detection**: Automated cluster detection and alert system
- **Disease Trends**: Monitor disease patterns in your area
- **Health Education Hub**: Evidence-based health and safety information
- **User Management**: Role-based access (community, laboratory, admin)

### Technical Highlights
- JWT-based authentication
- SQLite database
- Responsive mobile-first UI
- Real-time outbreak detection
- Haversine formula for distance calculations
- RESTful API architecture

## 📋 Project Structure

```
pathotrack/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── symptomController.js
│   │   │   ├── labController.js
│   │   │   ├── outbreakController.js
│   │   │   └── educationController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── symptomRoutes.js
│   │   │   ├── labRoutes.js
│   │   │   ├── outbreakRoutes.js
│   │   │   └── educationRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── encryption.js
│   │   ├── database.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginRegister.jsx
│   │   ├── SymptomChecker.jsx
│   │   ├── ReportSymptoms.jsx
│   │   ├── LabsMap.jsx
│   │   ├── Education.jsx
│   │   └── Outbreaks.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── navbar.css
│   │   ├── landing.css
│   │   ├── symptom-checker.css
│   │   ├── report-symptoms.css
│   │   ├── auth.css
│   │   ├── labs-map.css
│   │   ├── education.css
│   │   └── outbreaks.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── Dockerfile
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create .env file:
```bash
cp .env.example .env
```

3. Update .env with your configuration:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
DATABASE_PATH=./database.db
```

4. Start the backend:
```bash
npm start
```

Backend runs on `http://localhost:3000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+234812345678",
  "role": "community|laboratory|admin",
  "location": "Lagos, Nigeria"
}

Response: {
  "message": "User registered successfully",
  "user": {...},
  "token": "jwt_token"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}

Response: {
  "message": "Login successful",
  "user": {...},
  "token": "jwt_token"
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer {token}

Response: {
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "community",
  "location": "Lagos"
}
```

### Symptom Endpoints

#### Check Symptoms
```
POST /api/symptoms/check

{
  "symptoms": ["Fever", "Diarrhea", "Vomiting"]
}

Response: {
  "reportedSymptoms": [...],
  "possibleInfections": [
    {
      "infection": "Cholera",
      "description": "...",
      "severity": "high",
      "confidence": "85.5",
      "recommendedTests": ["Stool culture"],
      "preventiveMeasures": "..."
    }
  ],
  "disclaimer": "..."
}
```

#### Report Symptoms
```
POST /api/symptoms/report
Authorization: Bearer {token}

{
  "symptoms": ["Fever", "Cough"],
  "duration": 3,
  "durationUnit": "days",
  "location": "Lagos Mainland",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "severity": "moderate",
  "additionalNotes": "Started after traveling"
}

Response: {
  "message": "Symptom report submitted successfully",
  "reportId": 1
}
```

#### Get My Reports
```
GET /api/symptoms/my-reports
Authorization: Bearer {token}

Response: [
  {
    "id": 1,
    "symptoms": ["Fever"],
    "duration": 3,
    "location": "Lagos",
    "severity": "moderate",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Community Reports
```
GET /api/symptoms/community-reports

Response: [...]
```

### Laboratory Endpoints

#### Register Laboratory
```
POST /api/laboratories/register
Authorization: Bearer {token} (laboratory role required)

{
  "name": "Central Medical Lab",
  "address": "123 Hospital St, Lagos",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "phone": "+234812345678",
  "email": "lab@example.com",
  "openingHours": "Mon-Fri 8AM-5PM",
  "capabilities": "Blood culture, Stool culture, Urine microscopy"
}

Response: {
  "message": "Laboratory registered successfully",
  "labId": 1
}
```

#### Upload Lab Result
```
POST /api/laboratories/results
Authorization: Bearer {token} (laboratory role required)

{
  "testType": "Stool culture",
  "organism": "Vibrio cholerae",
  "location": "Lagos Mainland",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "specimen": "Stool sample",
  "notes": "Positive culture"
}

Response: {
  "message": "Lab result uploaded successfully",
  "resultId": 1
}
```

#### Get All Laboratories
```
GET /api/laboratories/all

Response: [
  {
    "id": 1,
    "name": "Central Medical Lab",
    "address": "123 Hospital St",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "phone": "+234812345678",
    "email": "lab@example.com"
  }
]
```

#### Get Nearby Laboratories
```
GET /api/laboratories/nearby?latitude=6.5244&longitude=3.3792&radiusKm=10

Response: [
  {
    "id": 1,
    "name": "Central Medical Lab",
    "distance": 2.5,
    ...
  }
]
```

### Outbreak Endpoints

#### Get Outbreak Alerts
```
GET /api/outbreaks/alerts

Response: [
  {
    "id": 1,
    "location": "Lagos Mainland",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "infectionType": "Typhoid",
    "reportCount": 15,
    "severity": "high",
    "description": "Possible Typhoid cluster detected...",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Trends
```
GET /api/outbreaks/trends?days=30&location=Lagos

Response: [
  {
    "date": "2024-01-15",
    "symptoms": ["Fever", "Diarrhea"],
    "count": 5
  }
]
```

### Education Endpoints

#### Get All Education Content
```
GET /api/education/content

Response: [
  {
    "id": 1,
    "category": "Hygiene Practices",
    "title": "Hand Hygiene",
    "description": "...",
    "content": "...",
    "image": "/images/..."
  }
]
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  role TEXT (community|laboratory|admin),
  location TEXT,
  latitude REAL,
  longitude REAL,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### Symptom Reports Table
```sql
CREATE TABLE symptom_reports (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL,
  symptoms TEXT NOT NULL (JSON array),
  duration INTEGER,
  durationUnit TEXT,
  location TEXT,
  latitude REAL,
  longitude REAL,
  severity TEXT (mild|moderate|severe),
  additionalNotes TEXT,
  status TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### Laboratory Results Table
```sql
CREATE TABLE lab_results (
  id INTEGER PRIMARY KEY,
  labId INTEGER NOT NULL,
  testType TEXT NOT NULL,
  organism TEXT,
  location TEXT,
  latitude REAL,
  longitude REAL,
  specimen TEXT,
  notes TEXT,
  resultDate DATETIME,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### Outbreak Alerts Table
```sql
CREATE TABLE outbreak_alerts (
  id INTEGER PRIMARY KEY,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  infectionType TEXT NOT NULL,
  reportCount INTEGER,
  severity TEXT (low|medium|high),
  description TEXT,
  status TEXT,
  createdAt DATETIME,
  resolvedAt DATETIME
)
```

## 🐳 Docker Deployment

### Build and Run with Docker Compose

1. Build images:
```bash
docker-compose build
```

2. Run services:
```bash
docker-compose up -d
```

3. Access application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/api/health

### Docker Images
- Frontend: Node.js 18 + Vite
- Backend: Node.js 18 + Express
- Database: SQLite (included in backend)

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- CORS configuration
- Input validation
- SQL injection prevention

## 🧪 Sample Test Data

The application includes sample data for:
- 10+ infections with symptoms mapping
- 15+ health education topics
- Sample laboratory locations
- Symptom-infection relationships

## 📱 Mobile Responsiveness

- Fully responsive design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized performance
- Progressive enhancement

## 🎨 UI Components

- Navigation bar with responsive menu
- Form controls with validation
- Cards and grids
- Alert/notification system
- Badge components
- Progress indicators
- Tables for data display

## 🔄 API Integration

- Axios for HTTP requests
- Request/response interceptors
- Error handling
- Token management
- Automatic token refresh capability

## 📊 Key Algorithms

### Symptom-Infection Mapping
- Weight-based scoring system
- Confidence calculation
- Top 5 suggestions ranking

### Outbreak Detection
- Spatial clustering (location-based)
- Time-window analysis (30 days)
- Threshold-based alerts (≥5 reports)
- Severity classification

### Distance Calculation
- Haversine formula for accuracy
- Real-time lab proximity search

## 🚀 Performance Optimization

- Code splitting with Vite
- Lazy loading routes
- CSS-in-file optimization
- Database query optimization
- Caching strategies

## 📈 Scalability

- Modular architecture
- Stateless API design
- Database indexing
- Horizontal scaling ready
- Load balancer compatible

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License

## 🆘 Support

For issues, questions, or suggestions, please create an issue on GitHub.

## 👥 Team

Built with ❤️ for public health

---

**Version**: 1.0.0
**Last Updated**: January 2024