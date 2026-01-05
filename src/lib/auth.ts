import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER!,
    pass: process.env.APP_USER_PASSWORD!,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      // Add any additional user fields here
      role: {
        type: "string",
        default: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        default: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const info = await transporter.sendMail({
          from: '"Shahrukhs Blog App" <blog_app@gmail.com>',
          to: user.email,
          subject: "Please verify your email address!",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .header {
      background-color: #111827;
      padding: 24px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 32px;
      color: #333333;
      line-height: 1.6;
    }
    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }
    .verify-button {
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
    }
    .verify-button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
    }
    .link {
      word-break: break-all;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>

    <div class="content">
      <p>Hi ${user.name},</p>

      <p>
        Thanks for signing up for <strong>Shahrukh’s Blog App</strong>!  
        Please confirm your email address by clicking the button below.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p class="link">${url}</p>

      <p>
        If you didn’t create an account, you can safely ignore this email.
      </p>

      <p>—<br/>Shahrukh’s Blog App Team</p>
    </div>

    <div class="footer">
      <p>© 2026 Shahrukh’s Blog App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
      }

    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
  },
});
