# Email Setup for Password Reset

The forgot password feature sends a 6-digit code via email. To enable email sending, configure the following environment variables in your `.env` file:

## Email Configuration

Add these variables to your `.env` file:

```env
# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@luxebella.com
```

## Setup Options

### Option 1: Gmail (Recommended for Development)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. Use these settings:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Use these settings:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   ```

### Option 3: Other SMTP Providers

You can use any SMTP provider. Common ones:
- **Mailgun**: `smtp.mailgun.org`
- **Amazon SES**: `email-smtp.us-east-1.amazonaws.com`
- **Microsoft 365**: `smtp.office365.com`

## Development Mode

If email is not configured, the system will:
1. Log the reset code to the console
2. Return the code in the API response (development only)
3. Display the code on the forgot password page

This allows you to test the flow without setting up email.

## Testing the Password Reset Flow

1. Go to `/auth/signin` and click "Forgot password?"
2. Enter your email address
3. You'll receive a 6-digit code (via email or displayed in dev mode)
4. Enter the code and your new password at `/auth/reset-password`
5. Sign in with your new password

## Security Notes

- Codes expire after 15 minutes
- Codes are single-use (deleted after successful reset)
- Invalid attempts don't reveal if an email exists (security best practice)
- Passwords are hashed using bcrypt before storage

