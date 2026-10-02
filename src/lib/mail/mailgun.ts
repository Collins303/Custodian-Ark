import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { env } from '@/lib/env';

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: 'api',
  key: env.MAILGUN_API_KEY,
});

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  if (!env.MAILGUN_API_KEY || !env.MAILGUN_DOMAIN) {
    return { ok: false, reason: 'Mailgun is not configured.' };
  }

  const recipients = Array.isArray(to) ? to : [to];

  await client.messages.create(env.MAILGUN_DOMAIN, {
    from: `${env.MAILGUN_FROM_NAME} <${env.MAILGUN_FROM_EMAIL}>`,
    to: recipients,
    subject,
    html,
    text: text ?? html.replace(/<[^>]*>/g, ' '),
  });

  return { ok: true };
}
