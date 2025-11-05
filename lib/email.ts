import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendPasswordResetCode(email: string, code: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('Email not configured. Would send code:', code, 'to:', email)
    // In development, you might want to log the code instead of sending
    return { success: true, code: code } // Return code for development
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Luxe Bella - Password Reset Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Alata', Arial, sans-serif;
                background-color: #faf3e0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                color: #603a2e;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
              }
              .code {
                background-color: #faf3e0;
                border: 2px solid #603a2e;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
              }
              .code-number {
                font-size: 36px;
                font-weight: bold;
                color: #603a2e;
                letter-spacing: 8px;
                font-family: monospace;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e8d5c4;
                color: #603a2e;
                font-size: 14px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">Luxe Bella</div>
              <h2 style="color: #603a2e;">Password Reset Code</h2>
              <p style="color: #603a2e;">You requested a password reset. Use the code below to reset your password:</p>
              
              <div class="code">
                <div class="code-number">${code}</div>
              </div>
              
              <p style="color: #603a2e; font-size: 14px;">This code will expire in 15 minutes.</p>
              <p style="color: #603a2e; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
              
              <div class="footer">
                <p>Luxe Bella Beautique</p>
                <p>Gorgetown Park Office Condominium<br>6604 Six Forks Rd #102, Raleigh, NC 27615</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}

