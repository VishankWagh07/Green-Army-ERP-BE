import nodemailer from "nodemailer";
import env from './env.js'

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER, // Your Gmail address (e.g., user@gmail.com)
    pass: env.GMAIL_PASS, // Your 16-character App Password
  },
});