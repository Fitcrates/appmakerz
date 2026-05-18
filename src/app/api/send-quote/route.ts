import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Language } from '@/lib/language';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0' };

type QuoteSelection = {
  serviceLabel?: string;
  baseLabel?: string;
  cmsLabel?: string;
  featuresLabels?: string[];
  deadlineLabel?: string;
};

function methodNotAllowed() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: { ...NO_STORE_HEADERS, Allow: 'POST' } });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

function escapeHtml(value: unknown) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatPrice(priceMin: number, priceMax: number, noPrice: boolean) {
  if (noPrice) {
    return 'Wycena indywidualna po konsultacji';
  }

  return `${priceMin.toLocaleString('pl-PL')} – ${priceMax.toLocaleString('pl-PL')} zł`;
}

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'pl';
}

function getQuoteDisclaimer(language: Language) {
  if (language === 'en') {
    return 'This is an estimated budget range, not a final offer. The exact scope, price and timeline will be confirmed after a short consultation.';
  }

  return 'To orientacyjny zakres budżetu, a nie finalna oferta. Dokładny zakres, cena i termin zostaną potwierdzone po krótkiej konsultacji.';
}

function formatSelection(selection: QuoteSelection) {
  const lines = [
    `<p><strong>Usługa:</strong> ${escapeHtml(selection.serviceLabel || '—')}</p>`,
    selection.baseLabel ? `<p><strong>Baza:</strong> ${escapeHtml(selection.baseLabel)}</p>` : '',
    selection.cmsLabel ? `<p><strong>CMS:</strong> ${escapeHtml(selection.cmsLabel)}</p>` : '',
    selection.featuresLabels?.length ? `<p><strong>Funkcje:</strong> ${selection.featuresLabels.map(escapeHtml).join(', ')}</p>` : '',
    selection.deadlineLabel ? `<p><strong>Deadline:</strong> ${escapeHtml(selection.deadlineLabel)}</p>` : '',
  ];

  return lines.filter(Boolean).join('\n');
}

function getDeveloperEmailTemplate(input: { name: string; email: string; phone: string; message: string; selection: QuoteSelection; priceText: string; disclaimer: string }) {
  return `
    <div style="font-family:Arial,sans-serif;background:#0d0f1e;color:#c9d1e8;padding:32px;line-height:1.6;">
      <div style="max-width:640px;margin:0 auto;background:#131629;border:1px solid #1e2240;border-radius:16px;padding:32px;">
        <h2 style="color:#ffffff;margin-top:0;">Nowe zapytanie z kalkulatora</h2>
        <p><strong>Imię:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(input.phone || '—')}</p>
        <hr style="border:none;border-top:1px solid #1e2240;margin:24px 0;" />
        <h3 style="color:#00e5c3;">Wybrane opcje</h3>
        ${formatSelection(input.selection)}
        <p><strong>Orientacyjna wycena:</strong> ${escapeHtml(input.priceText)}</p>
        <p style="font-size:12px;color:#8892b0;margin-top:12px;">${escapeHtml(input.disclaimer)}</p>
        <hr style="border:none;border-top:1px solid #1e2240;margin:24px 0;" />
        <p><strong>Wiadomość:</strong></p>
        <p>${escapeHtml(input.message || '—').replace(/\n/g, '<br/>')}</p>
      </div>
    </div>
  `;
}

function getClientEmailTemplate(input: { name: string; selection: QuoteSelection; priceText: string; language: Language; disclaimer: string }) {
  const title = input.language === 'en' ? 'Thank you for your inquiry' : 'Dziękuję za zapytanie';
  const greeting = input.language === 'en' ? `Hi ${escapeHtml(input.name)},` : `Cześć ${escapeHtml(input.name)},`;
  const intro = input.language === 'en'
    ? 'I received your inquiry and will get back to you as soon as possible. Below is the summary from the calculator.'
    : 'Otrzymałem Twoje zapytanie i odezwę się możliwie szybko. Poniżej znajdziesz podsumowanie wyborów z kalkulatora.';
  const priceLabel = input.language === 'en' ? 'Estimated budget' : 'Orientacyjna wycena';

  return `
    <div style="font-family:Arial,sans-serif;background:#0d0f1e;color:#c9d1e8;padding:32px;line-height:1.6;">
      <div style="max-width:640px;margin:0 auto;background:#131629;border:1px solid #1e2240;border-radius:16px;padding:32px;">
        <h2 style="color:#ffffff;margin-top:0;">${title}</h2>
        <p>${greeting}</p>
        <p>${intro}</p>
        <hr style="border:none;border-top:1px solid #1e2240;margin:24px 0;" />
        ${formatSelection(input.selection)}
        <p><strong>${priceLabel}:</strong> ${escapeHtml(input.priceText)}</p>
        <p style="font-size:12px;color:#8892b0;margin-top:24px;">${escapeHtml(input.disclaimer)}</p>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 503, headers: NO_STORE_HEADERS });
    }

    const body = await request.json();
    const name = String(body?.name || '').trim().slice(0, 120);
    const email = String(body?.email || '').trim().slice(0, 180);
    const phone = String(body?.phone || '').trim().slice(0, 80);
    const message = String(body?.message || '').trim().slice(0, 2000);
    const selection = (body?.selection || {}) as QuoteSelection;
    const priceMin = Number(body?.priceMin || 0);
    const priceMax = Number(body?.priceMax || 0);
    const noPrice = Boolean(body?.noPrice);
    const language = isLanguage(body?.language) ? body.language : 'pl';

    if (!name || !email || !selection.serviceLabel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const fromEmail = process.env.QUOTE_FROM_EMAIL || 'kontakt@appcrates.pl';
    const toEmail = process.env.QUOTE_TO_EMAIL || process.env.EMAIL_USER || 'appcratesdev@gmail.com';
    const priceText = formatPrice(priceMin, priceMax, noPrice);
    const disclaimer = getQuoteDisclaimer(language);

    const developerEmail = await resend.emails.send({
      from: `AppCrates Kalkulator <${fromEmail}>`,
      to: toEmail,
      subject: `Nowe zapytanie — ${selection.serviceLabel}`,
      replyTo: email,
      html: getDeveloperEmailTemplate({ name, email, phone, message, selection, priceText, disclaimer }),
    });

    if (developerEmail.error) {
      return NextResponse.json({ error: developerEmail.error.message }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const clientEmail = await resend.emails.send({
      from: `AppCrates <${fromEmail}>`,
      to: email,
      subject: 'Otrzymałem Twoje zapytanie — AppCrates',
      html: getClientEmailTemplate({ name, selection, priceText, language, disclaimer }),
    });

    if (clientEmail.error) {
      return NextResponse.json({ error: clientEmail.error.message }, { status: 400, headers: NO_STORE_HEADERS });
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Quote route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
