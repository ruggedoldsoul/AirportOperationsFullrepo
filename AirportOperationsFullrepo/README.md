# Airport Operations Full Repository

This repository contains both the frontend and backend applications for the Airport Operations system.

## Project Structure

```
AirportOperationsFullrepo/
├── backend/         # .NET Core backend API
├── frontend/        # Next.js frontend application
└── docker-compose.yml
```

## Prerequisites

- Docker Desktop
- .NET SDK 7.0 or later
- Node.js 18 or later
- npm or yarn
- PostgreSQL 14 or later

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd AirportOperationsFullrepo
```

2. Set up the database:
```bash
# The application uses PostgreSQL. Make sure it's running and create a database named 'airportops'
# The default connection string in appsettings.json is:
# "Host=localhost;Database=airportops;Username=postgres;Password=postgres"
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

This will start both the frontend and backend services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:7214
- Swagger UI: http://localhost:7214/swagger

## Admin Access

The system comes with a pre-configured admin account:
- Email: Nakumoji@outlook.com
- Password: Ab12345

Please change these credentials after first login for security purposes.

## Development

### Backend Development
```bash
cd backend
dotnet run
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:7214
```

### Backend (appsettings.json)
The backend configuration is managed through appsettings.json and environment variables in the docker-compose.yml file.

## Architecture

- Backend: ASP.NET Core Web API with Entity Framework Core
- Frontend: Next.js with TypeScript and Tailwind CSS
- Communication: REST API with CORS enabled
- Container Orchestration: Docker Compose
- Database: PostgreSQL

## Security Notes

1. The admin credentials provided are for initial setup only. Please change them immediately after first login.
2. All passwords are securely hashed using BCrypt before storage.
3. API endpoints are protected with JWT authentication.
4. CORS is configured to allow only the frontend application. 