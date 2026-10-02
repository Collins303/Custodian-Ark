import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendTransactionalEmail } from '@/lib/mail/mailgun';

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const payload = Object.fromEntries(form.entries());
    const parsed = newsletterSchema.parse(payload);

    const emailResult = await sendTransactionalEmail({
      to: parsed.email,
      subject: 'Welcome to Custodian Ark updates',
      html: `
        <h2>Thanks for subscribing</h2>
        <p>You’re now signed up for news, product releases, and energy insights from Custodian Ark.</p>
      `,
      text: 'You’re now signed up for news, product releases, and energy insights from Custodian Ark.',
    });

    if (!emailResult.ok) {
      return NextResponse.json({ ok: false, error: emailResult.reason }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Newsletter signup successful.',
      data: parsed,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }
}
