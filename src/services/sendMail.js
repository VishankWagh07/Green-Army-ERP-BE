import env from "../config/env.js";
import { transporter } from "../config/mail.js";
import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: env.GMAIL_USER, // sender address
      to, // list of recipients
      subject, // subject line
      text, // plain text body
      html, // HTML body
    });

    console.log("Email sent successfully");
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
