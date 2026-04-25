import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Make sure to add RESEND_API_KEY to your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Default to onboarding@resend.dev if a custom domain is not yet verified.
    // Replace with your verified domain email (e.g., 'kontakt@appcrates.pl') when ready.
    const fromEmail = 'onboarding@resend.dev';
    const toEmail = process.env.EMAIL_USER || 'appcratesdev@gmail.com';

    const data = await resend.emails.send({
      from: `AppCrates Form <${fromEmail}>`,
      to: toEmail,
      subject: `Nowa wiadomość z AppCrates od: ${name}`,
      replyTo: email,
      html: `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Od:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p style="white-space: pre-wrap;">${message}</p>
      `,
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
