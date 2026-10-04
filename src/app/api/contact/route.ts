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

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let payload: any = {};

    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    }

    const parsed = contactSchema.parse(payload);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    await transporter.sendMail({
      from: '"Custodian Ark Contact" <no-reply@custodianark.com>',
      to: parsed.email,
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
  } catch (error: any) {
    console.error("DETAILED CONTACT ERROR:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || 'Invalid contact form submission.' 
    }, { status: 400 });
  }
}