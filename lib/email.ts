import type { Booking } from '@/types'
import { STATUS_LABELS } from '@/types'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'noreply@primedrive.de'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@primedrive.de'

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log(`[Email MOCK] To: ${to} | Subject: ${subject}`)
    return
  }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
}

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;margin:0;padding:20px}
  .card{background:#fff;border-radius:16px;padding:32px;max-width:560px;margin:0 auto;box-shadow:0 2px 16px rgba(0,0,0,.08)}
  .logo{font-size:22px;font-weight:800;color:#1a56db;margin-bottom:24px}
  .logo span{color:#111}
  h1{font-size:20px;font-weight:700;color:#111;margin:0 0 8px}
  p{color:#555;font-size:15px;line-height:1.6;margin:0 0 16px}
  .detail-row{display:flex;gap:8px;margin-bottom:8px;font-size:14px}
  .label{color:#888;min-width:130px}
  .value{color:#111;font-weight:500}
  .status{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600}
  .btn{display:inline-block;background:#1a56db;color:#fff;padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;margin-top:8px}
  .footer{text-align:center;font-size:12px;color:#aaa;margin-top:24px}
  .divider{border:none;border-top:1px solid #eee;margin:20px 0}
</style></head>
<body><div class="card">
  <div class="logo">Prime<span>Drive</span> 🚗</div>
  ${content}
  <div class="footer">PrimeDrive GmbH · Frankfurt am Main · <a href="https://primedrive.de">primedrive.de</a></div>
</div></body></html>`
}

export async function sendBookingConfirmation(booking: Booking) {
  const dep = booking.flightTime ? new Date(booking.flightTime).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '–'
  const pickup = new Date(booking.scheduledAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })

  const html = baseTemplate(`
    <h1>✅ Buchung bestätigt!</h1>
    <p>Hallo ${booking.passengerName}, deine Fahrt wurde erfolgreich gebucht.</p>
    <hr class="divider">
    <div class="detail-row"><span class="label">Buchungs-ID:</span><span class="value">${booking.id}</span></div>
    <div class="detail-row"><span class="label">Abholung:</span><span class="value">${booking.pickup.address}</span></div>
    <div class="detail-row"><span class="label">Ziel:</span><span class="value">${booking.dropoff.address}</span></div>
    <div class="detail-row"><span class="label">Abholzeit:</span><span class="value">${pickup}</span></div>
    ${booking.flightNumber ? `<div class="detail-row"><span class="label">Flug:</span><span class="value">${booking.flightNumber} · ${dep}</span></div>` : ''}
    <div class="detail-row"><span class="label">Fahrzeugklasse:</span><span class="value">${booking.rideClass.toUpperCase()}</span></div>
    <div class="detail-row"><span class="label">Passagiere:</span><span class="value">${booking.passengers}</span></div>
    <div class="detail-row"><span class="label">Gepäck:</span><span class="value">${booking.luggage} Stück</span></div>
    <div class="detail-row"><span class="label">Preis:</span><span class="value">${booking.price.toFixed(2)} €</span></div>
    <div class="detail-row"><span class="label">Zahlung:</span><span class="value">${booking.paymentMethod === 'card' ? 'Kreditkarte' : booking.paymentMethod === 'cash' ? 'Barzahlung' : 'PayPal'}</span></div>
    <hr class="divider">
    <p>Du kannst deine Fahrt jederzeit unter folgender ID verfolgen:</p>
    <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://primedrive.de'}/track/${booking.id}">Fahrt verfolgen →</a>
  `)

  await Promise.all([
    sendEmail(booking.passengerEmail, `✅ PrimeDrive – Buchung ${booking.id} bestätigt`, html),
    sendEmail(ADMIN_EMAIL, `[Admin] Neue Buchung: ${booking.id} – ${booking.passengerName}`, html),
  ])
}

export async function sendCancellationEmail(booking: Booking, reason?: string) {
  const html = baseTemplate(`
    <h1>❌ Buchung storniert</h1>
    <p>Hallo ${booking.passengerName}, deine Fahrt wurde storniert.</p>
    <hr class="divider">
    <div class="detail-row"><span class="label">Buchungs-ID:</span><span class="value">${booking.id}</span></div>
    <div class="detail-row"><span class="label">Abholung:</span><span class="value">${booking.pickup.address}</span></div>
    <div class="detail-row"><span class="label">Ziel:</span><span class="value">${booking.dropoff.address}</span></div>
    ${reason ? `<div class="detail-row"><span class="label">Grund:</span><span class="value">${reason}</span></div>` : ''}
    <hr class="divider">
    <p>Du kannst jederzeit eine neue Fahrt buchen:</p>
    <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://primedrive.de'}/booking">Neue Fahrt buchen →</a>
  `)

  await sendEmail(booking.passengerEmail, `❌ PrimeDrive – Buchung ${booking.id} storniert`, html)
}

export async function sendStatusUpdateEmail(booking: Booking) {
  const html = baseTemplate(`
    <h1>🔔 Fahrt-Update</h1>
    <p>Hallo ${booking.passengerName}, der Status deiner Fahrt hat sich geändert.</p>
    <hr class="divider">
    <div class="detail-row"><span class="label">Buchungs-ID:</span><span class="value">${booking.id}</span></div>
    <div class="detail-row"><span class="label">Neuer Status:</span><span class="value">${STATUS_LABELS[booking.status]}</span></div>
    ${booking.driverName ? `<div class="detail-row"><span class="label">Fahrer:</span><span class="value">${booking.driverName}</span></div>` : ''}
    ${booking.driverPlate ? `<div class="detail-row"><span class="label">Kennzeichen:</span><span class="value">${booking.driverPlate}</span></div>` : ''}
    ${booking.driverEta ? `<div class="detail-row"><span class="label">ETA:</span><span class="value">ca. ${booking.driverEta} Minuten</span></div>` : ''}
    <hr class="divider">
    <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://primedrive.de'}/track/${booking.id}">Fahrt verfolgen →</a>
  `)

  await sendEmail(booking.passengerEmail, `🔔 PrimeDrive – Fahrt-Update: ${STATUS_LABELS[booking.status]}`, html)
}
