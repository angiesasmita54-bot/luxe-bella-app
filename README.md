# Luxe Bella App

A comprehensive beauty & spa management application that runs on Android, iOS phones/tablets, and desktop browsers. Deployed on Azure.

## Features

### Authentication
- ✅ Facebook Login
- ✅ Google Login
- ✅ Email/Password Login

### Core Features
- ✅ Online Reservations with real-time calendar
- ✅ Service Catalog with visual menu
- ✅ Payment Integration (Card, Zelle, Apple Pay, Google Pay, Cash)
- ✅ Deposit system for appointments
- ✅ Customer History & Profile
- ✅ Personalized treatment recommendations

### Loyalty & Marketing
- ✅ Points-based loyalty program
- ✅ Digital coupons & promotions
- ✅ Unlimited text messaging
- ✅ Push notifications for promotions

### Experience Features
- ✅ Personalized customer profiles
- ✅ Calendar integration (Google Calendar/Apple Calendar)
- ✅ Ratings & Reviews system
- ✅ Gamification with badges

### Management Tools
- ✅ Staff panel with daily agenda
- ✅ Sales control & reporting
- ✅ Automatic reports (billing, missed appointments, best-selling services)

### Automated Notifications
- ✅ Appointment reminders (48h, 24h, 1h before)
- ✅ Birthday messages with special offers
- ✅ Post-service thank you messages
- ✅ Review requests

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **SMS/WhatsApp**: Twilio
- **Deployment**: Azure App Service

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Azure account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd luxe-bella-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

See `.env.example` for all required environment variables including:
- Database connection
- OAuth credentials (Google, Facebook)
- Stripe payment keys
- Twilio credentials for SMS/WhatsApp
- Azure storage configuration
- Push notification service keys

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:
- User (with Customer/Staff profiles)
- Service
- Appointment
- Payment
- Review
- LoyaltyPoints & LoyaltyTransaction
- Badge
- Coupon
- Notification & NotificationSchedule
- Report

## Deployment to Azure

### Option 1: Azure App Service

1. Create a resource group in Azure
2. Deploy using the ARM template in `azure/app-service.json`
3. Configure environment variables in Azure Portal
4. Set up continuous deployment from GitHub/Azure DevOps

### Option 2: Azure Pipeline

Use the pipeline configuration in `azure/deploy.yml` for automated CI/CD.

### Database Setup

1. Create a PostgreSQL database in Azure (Azure Database for PostgreSQL)
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npx prisma migrate deploy`

### Cron Jobs

Set up Azure Functions or scheduled tasks to call `/api/cron/notifications` for automated reminders and birthday messages.

## Mobile Apps

The web app is designed as a Progressive Web App (PWA) and works on mobile devices. For native mobile apps, see the `mobile/` directory (React Native/Expo setup).

## Project Structure

```
luxe-bella-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── services/          # Service pages
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Database schema
├── azure/                 # Azure deployment configs
└── mobile/                # React Native app (separate)
```

## Development

### Running Prisma Studio

```bash
npx prisma studio
```

### Running Tests

```bash
npm test
```

## License

Proprietary - All rights reserved

## Support

For support, contact the development team.
