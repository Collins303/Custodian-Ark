import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendTransactionalEmail } from '@/lib/mail/mailgun';

const quoteSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional().or(z.literal('')),
  email: z.string().email(),
  phone: z.string().min(7),
  product: z.string().min(2),
  quantity: z.string().min(1),
  projectType: z.string().min(2),
  location: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const payload = Object.fromEntries(form.entries());
    const parsed = quoteSchema.parse(payload);

    const emailResult = await sendTransactionalEmail({
      to: parsed.email,
      subject: `Quote request for ${parsed.product}`,
      html: `
        <h2>New quote request</h2>
        <p><strong>Name:</strong> ${parsed.name}</p>
        <p><strong>Company:</strong> ${parsed.company ?? 'Not provided'}</p>
        <p><strong>Email:</strong> ${parsed.email}</p>
        <p><strong>Phone:</strong> ${parsed.phone}</p>
        <p><strong>Product:</strong> ${parsed.product}</p>
        <p><strong>Quantity:</strong> ${parsed.quantity}</p>
        <p><strong>Project type:</strong> ${parsed.projectType}</p>
        <p><strong>Location:</strong> ${parsed.location}</p>
        <p><strong>Message:</strong></p>
        <p>${parsed.message.replace(/\n/g, '<br />')}</p>
      `,
      text: `New quote request from ${parsed.name}\nCompany: ${parsed.company ?? 'Not provided'}\nEmail: ${parsed.email}\nPhone: ${parsed.phone}\nProduct: ${parsed.product}\nQuantity: ${parsed.quantity}\nProject type: ${parsed.projectType}\nLocation: ${parsed.location}\n\n${parsed.message}`,
    });

    if (!emailResult.ok) {
      return NextResponse.json({ ok: false, error: emailResult.reason }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Quote request submitted.',
      data: parsed,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'The quote form could not be processed.' }, { status: 400 });
  }
}
