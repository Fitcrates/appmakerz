import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getContactTemplate } from '@/utils/emailTemplates';

// Make sure to add RESEND_API_KEY to your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Używamy zweryfikowanej domeny AppCrates
    const fromEmail = 'kontakt@appcrates.pl';
    const toEmail = process.env.EMAIL_USER || 'appcratesdev@gmail.com';

    const data = await resend.emails.send({
      from: `AppCrates Form <${fromEmail}>`,
      to: toEmail,
      subject: `Nowa wiadomość z AppCrates od: ${name}`,
      replyTo: email,
      html: getContactTemplate(name, message),
    });

    if (data.error) {
      console.error('Resend API error:', data.error);
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Internal Resend error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
