import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().min(2),
  message: z.string().min(10),
});

// Create the transporter using your Mailtrap environment variables
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const payload = Object.fromEntries(form.entries());
    const parsed = contactSchema.parse(payload);

    // Send the email using Nodemailer and Mailtrap
    await transporter.sendMail({
      from: '"Custodian Ark Contact" <no-reply@custodianark.com>', // The sender address
      to: parsed.email, // Sends confirmation to the user who filled the form
      subject: `Contact request: ${parsed.subject}`,
      html: `
        <h2>New contact request</h2>
        <p><strong>Name:</strong> ${parsed.name}</p>
        <p><strong>Email:</strong> ${parsed.email}</p>
        <p><strong>Phone:</strong> ${parsed.phone ?? 'Not provided'}</p>
        <p><strong>Subject:</strong> ${parsed.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${parsed.message.replace(/\n/g, '<br />')}</p>
      `,
      text: `New contact request from ${parsed.name} (${parsed.email})\nPhone: ${parsed.phone ?? 'Not provided'}\nSubject: ${parsed.subject}\n\n${parsed.message}`,
    });

    return NextResponse.json({
      ok: true,
      message: 'Contact request submitted successfully.',
      data: parsed,
    });
  } catch (error) {
    console.error("Mailtrap sending error:", error);
    return NextResponse.json({ ok: false, error: 'Invalid contact form submission.' }, { status: 400 });
  }
}