# Quick Start Guide - Luxe Bella App

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your configuration:
   - **DATABASE_URL**: Your PostgreSQL connection string
   - **NEXTAUTH_SECRET**: Generate a random secret (you can use `openssl rand -base64 32`)
   - **NEXTAUTH_URL**: Your app URL (use `http://localhost:3000` for local development)
   - **OAuth Credentials**: Get from Google Cloud Console and Facebook Developer Console
   - **Stripe Keys**: Get from Stripe Dashboard
   - **Twilio Credentials**: Get from Twilio Console

## Step 3: Set Up Database

1. Generate Prisma Client:
```bash
npm run db:generate
```

2. Create and run migrations:
```bash
npm run db:migrate
```

3. (Optional) Seed the database with sample data:
```bash
npm run db:seed
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Create Your First Admin User

You can create an admin user through the Prisma Studio:

```bash
npm run db:studio
```

Or through the API after setting up authentication.

## Next Steps

1. **Set up OAuth Providers**:
   - Google: https://console.cloud.google.com/
   - Facebook: https://developers.facebook.com/
   - Add redirect URLs: `http://localhost:3000/api/auth/callback/google` and similar for Facebook

2. **Configure Stripe**:
   - Create account at https://stripe.com
   - Get API keys from dashboard
   - Set up webhook endpoint: `https://your-domain.com/api/payments/webhook`

3. **Set up Twilio** (for SMS/WhatsApp):
   - Create account at https://www.twilio.com
   - Get Account SID and Auth Token
   - Purchase a phone number

4. **Configure Azure** (for production):
   - Follow the deployment guide in `DEPLOYMENT.md`
   - Set up Azure App Service
   - Configure environment variables in Azure Portal

## Testing the App

1. **Sign Up/Sign In**:
   - Visit `/auth/signin`
   - Try Google or Facebook login
   - Or create an account with email

2. **Browse Services**:
   - Visit `/services`
   - View available services

3. **Book an Appointment**:
   - Click on a service
   - Select date and time
   - Complete booking

4. **View Dashboard**:
   - After signing in, visit `/dashboard`
   - See your appointments and loyalty points

5. **Staff Dashboard** (if you have staff role):
   - Visit `/staff`
   - View daily schedule and sales

## Common Issues

### Database Connection Error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database exists

### OAuth Not Working
- Verify redirect URLs match exactly
- Check client ID and secret are correct
- Ensure NEXTAUTH_URL matches your domain

### Payment Issues
- Verify Stripe keys are correct
- Check webhook endpoint is accessible
- Ensure payment intent creation succeeds

## Project Structure

```
luxe-bella-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── services/          # Service pages
│   └── ...
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── azure/                 # Azure deployment configs
```

## Useful Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:studio` - Open Prisma Studio
- `npm run db:migrate` - Run database migrations
- `npm run lint` - Run ESLint

## Getting Help

- Check `README.md` for detailed documentation
- Review `FEATURES.md` for feature implementation status
- See `DEPLOYMENT.md` for Azure deployment instructions

