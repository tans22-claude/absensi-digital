# API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "role": "ADMIN|TEACHER|STUDENT|PARENT"
}
```

### POST /api/auth/[...nextauth]
NextAuth endpoints for login/logout.

## Dashboard Endpoints

### GET /api/dashboard/stats
Get dashboard statistics.

**Response:**
```json
{
  "totalStudents": 100,
  "presentToday": 85,
  "absentToday": 15,
  "presentPercentage": 85,
  "totalAttendance": 2500
}
```

### GET /api/dashboard/chart
Get attendance chart data for last 7 days.

### GET /api/dashboard/recent
Get recent attendance records.

## Attendance Endpoints

### POST /api/attendance/qr-scan
Submit attendance via QR code scan.

**Request Body:**
```json
{
  "classId": "string",
  "qrData": "string"
}
```

### POST /api/attendance/bulk
Bulk attendance input (manual).

**Request Body:**
```json
{
  "classId": "string",
  "date": "2024-01-01",
  "attendances": [
    {
      "studentId": "string",
      "status": "PRESENT|SICK|PERMISSION|ABSENT",
      "note": "string"
    }
  ]
}
```

### GET /api/attendance/history
Get attendance history with filters.

**Query Parameters:**
- `search`: Search student name
- `date`: Filter by date

## Reports Endpoints

### GET /api/reports/data
Get report data.

**Query Parameters:**
- `classId`: Filter by class (optional)
- `startDate`: Start date (required)
- `endDate`: End date (required)

### GET /api/reports/export
Export report to PDF or CSV.

**Query Parameters:**
- `classId`: Filter by class (optional)
- `startDate`: Start date (required)
- `endDate`: End date (required)
- `format`: pdf|csv

## User Management Endpoints

### GET /api/users
Get all users (Admin only).

### POST /api/users
Create new user (Admin only).

### PUT /api/users/[id]
Update user (Admin only).

### DELETE /api/users/[id]
Delete user (Admin only).

## Classes & Students Endpoints

### GET /api/classes
Get all classes.

### GET /api/students
Get all students.

**Query Parameters:**
- `classId`: Filter by class
