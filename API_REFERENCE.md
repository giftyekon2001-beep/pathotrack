# PathoTrack API Reference

Complete API documentation for PathoTrack backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

## Response Format

All responses are JSON:

```json
{
  "message": "Success message",
  "data": {},
  "error": "Error message if any"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication Endpoints

### POST /auth/register

Register new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+234812345678",
  "role": "community",
  "location": "Lagos, Nigeria"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "community"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- Email already registered
- Missing required fields

---

### POST /auth/login

Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "community"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- Invalid credentials
- User not found

---

### GET /auth/profile

Get authenticated user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "community",
  "location": "Lagos"
}
```

---

### PUT /auth/profile

Update user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "location": "Abuja",
  "latitude": 9.0765,
  "longitude": 7.3986
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

---

## Symptom Endpoints

### POST /symptoms/check

Check symptoms without authentication.

**Request:**
```json
{
  "symptoms": ["Fever", "Diarrhea", "Vomiting"]
}
```

**Response:**
```json
{
  "reportedSymptoms": ["Fever", "Diarrhea", "Vomiting"],
  "possibleInfections": [
    {
      "infection": "Cholera",
      "description": "Acute diarrheal disease caused by Vibrio cholerae",
      "severity": "high",
      "confidence": "85.5",
      "recommendedTests": ["Stool culture", "Rapid test"],
      "preventiveMeasures": "Clean drinking water..."
    },
    {
      "infection": "Typhoid",
      "description": "Bacterial infection caused by Salmonella typhi",
      "severity": "high",
      "confidence": "72.3",
      "recommendedTests": ["Widal test", "Blood culture"],
      "preventiveMeasures": "Safe drinking water..."
    }
  ],
  "disclaimer": "This is for informational purposes only..."
}
```

**Query Parameters:**
- None

**Errors:**
- Invalid symptom format
- Empty symptoms list

---

### POST /symptoms/report

Submit symptom report (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
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
```

**Response:**
```json
{
  "message": "Symptom report submitted successfully",
  "reportId": 1
}
```

**Errors:**
- No symptoms provided
- Invalid location data
- User not authenticated

---

### GET /symptoms/my-reports

Get user's symptom reports.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "symptoms": ["Fever", "Cough"],
    "duration": 3,
    "durationUnit": "days",
    "location": "Lagos Mainland",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "severity": "moderate",
    "additionalNotes": "Started after traveling",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### GET /symptoms/community-reports

Get anonymized community reports.

**Response:**
```json
[
  {
    "id": 1,
    "location": "Lagos Mainland",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "symptoms": ["Fever", "Diarrhea"],
    "severity": "moderate",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Query Parameters:**
- `location` (optional): Filter by location
- `radius` (optional): Search radius in km

---

## Laboratory Endpoints

### POST /laboratories/register

Register laboratory (laboratory role required).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Central Medical Lab",
  "address": "123 Hospital St, Lagos",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "phone": "+234812345678",
  "email": "lab@example.com",
  "openingHours": "Mon-Fri 8AM-5PM, Sat 9AM-2PM",
  "capabilities": "Blood culture, Stool culture, Urine microscopy"
}
```

**Response:**
```json
{
  "message": "Laboratory registered successfully",
  "labId": 1
}
```

**Errors:**
- Insufficient permissions
- Laboratory already registered

---

### POST /laboratories/results

Upload lab test result (laboratory role required).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "testType": "Stool culture",
  "organism": "Vibrio cholerae",
  "location": "Lagos Mainland",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "specimen": "Stool sample",
  "notes": "Positive culture, organism identified"
}
```

**Response:**
```json
{
  "message": "Lab result uploaded successfully",
  "resultId": 1
}
```

---

### GET /laboratories/results

Get lab's test results (laboratory role required).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "testType": "Stool culture",
    "organism": "Vibrio cholerae",
    "location": "Lagos Mainland",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "specimen": "Stool sample",
    "notes": "Positive culture",
    "resultDate": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### GET /laboratories/all

Get all registered laboratories.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Central Medical Lab",
    "address": "123 Hospital St, Lagos",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "phone": "+234812345678",
    "email": "lab@example.com",
    "openingHours": "Mon-Fri 8AM-5PM",
    "capabilities": "Blood culture, Stool culture",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### GET /laboratories/nearby

Get nearby laboratories.

**Query Parameters:**
- `latitude` (required): User latitude
- `longitude` (required): User longitude
- `radiusKm` (optional, default: 10): Search radius in km

**Response:**
```json
[
  {
    "id": 1,
    "name": "Central Medical Lab",
    "address": "123 Hospital St, Lagos",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "phone": "+234812345678",
    "email": "lab@example.com",
    "distance": 2.5,
    "openingHours": "Mon-Fri 8AM-5PM",
    "capabilities": "Blood culture, Stool culture"
  }
]
```

**Example:**
```
GET /laboratories/nearby?latitude=6.5244&longitude=3.3792&radiusKm=10
```

---

## Outbreak Endpoints

### GET /outbreaks/alerts

Get active outbreak alerts.

**Response:**
```json
[
  {
    "id": 1,
    "location": "Lagos Mainland",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "infectionType": "Typhoid",
    "reportCount": 15,
    "severity": "high",
    "description": "Possible Typhoid cluster detected with 15 reports...",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "resolvedAt": null
  }
]
```

---

### GET /outbreaks/detect

Detect and analyze outbreaks (admin/laboratory role required).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "outbreaks": [
    {
      "location": "Lagos Mainland",
      "latitude": 6.5244,
      "longitude": 3.3792,
      "infectionType": "Typhoid",
      "reportCount": 15,
      "severity": "high",
      "description": "Possible Typhoid cluster..."
    }
  ],
  "lastChecked": "2024-01-15T10:30:00Z"
}
```

---

### GET /outbreaks/trends

Get disease trend data.

**Query Parameters:**
- `days` (optional, default: 30): Number of days to analyze
- `location` (optional): Filter by location

**Response:**
```json
[
  {
    "date": "2024-01-15",
    "symptoms": ["Fever", "Diarrhea"],
    "count": 5
  },
  {
    "date": "2024-01-14",
    "symptoms": ["Fever"],
    "count": 3
  }
]
```

**Example:**
```
GET /outbreaks/trends?days=30&location=Lagos
```

---

## Education Endpoints

### GET /education/content

Get all health education content.

**Response:**
```json
[
  {
    "id": 1,
    "category": "Hygiene Practices",
    "title": "Hand Hygiene",
    "description": "Proper handwashing is one of the most effective ways...",
    "content": "Wash your hands frequently with soap and clean water...",
    "image": "/images/hand-hygiene.jpg"
  },
  {
    "id": 2,
    "category": "Food Safety",
    "title": "Safe Food Handling",
    "description": "Prevent foodborne illnesses through proper food handling",
    "content": "Cook food to safe internal temperatures...",
    "image": "/images/food-safety.jpg"
  }
]
```

---

### GET /education/content/:category

Get education content by category.

**Response:**
```json
[
  {
    "id": 1,
    "category": "Hygiene Practices",
    "title": "Hand Hygiene",
    ...
  }
]
```

**Example:**
```
GET /education/content/Hygiene%20Practices
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

No rate limiting is currently implemented but recommended for production:

- Authentication endpoints: 5 requests per minute per IP
- API endpoints: 100 requests per minute per user
- Public endpoints: 1000 requests per hour per IP

---

## Pagination

Endpoints returning large datasets support pagination:

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Items per page

**Response includes:**
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

---

## Filtering

Endpoints support filtering on searchable fields:

**Query Parameters:**
- `search`: Search term
- `status`: Filter by status
- `severity`: Filter by severity

---

## Sorting

Endpoints support sorting:

**Query Parameters:**
- `sort`: Field name (prefix with `-` for descending)
- `order`: `asc` or `desc`

**Examples:**
```
GET /api/outbreaks/alerts?sort=-createdAt
GET /api/symptoms/my-reports?sort=severity&order=desc
```

---

## Webhooks

Future feature for real-time outbreak notifications:

```json
POST https://your-app.com/webhooks/outbreak
{
  "event": "outbreak.detected",
  "data": {
    "location": "Lagos",
    "infectionType": "Typhoid",
    "reportCount": 15
  }
}
```

---

## API Versioning

Current version: v1

Future versions will use path versioning:
```
/api/v1/...
/api/v2/...
```

---

## Changelog

### v1.0.0 (January 2024)
- Initial release
- Authentication endpoints
- Symptom reporting
- Laboratory endpoints
- Outbreak detection
- Education content

---

For issues or questions about the API, please refer to the README.md or create a GitHub issue.