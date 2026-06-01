// Vercel Function — recibe el formulario "agendar una llamada" y envía el lead
// por SMTP a info@alasservice.com. Las credenciales viven en variables de entorno
// (Vercel → Settings → Environment Variables), NUNCA en el código.
const nodemailer = require('nodemailer');

const esc = (s) =>
  String(s == null ? '' : s).replace(/[<>&"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])
  );

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    // Honeypot anti-spam: si un bot rellena el campo oculto, fingimos éxito sin enviar.
    if (b.company) return res.status(200).json({ success: true });

    const name = (b.name || '').trim();
    const email = (b.email || '').trim();
    const phone = (b.phone || '').trim();
    const perfil = (b.perfil || '').trim();
    const mensaje = (b.mensaje || '').trim();

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Faltan datos o el email no es válido' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_TO } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error('Faltan variables de entorno SMTP');
      return res.status(500).json({ error: 'Servidor de correo no configurado' });
    }

    const port = Number(SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // SSL directo en el puerto 465
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const to = LEAD_TO || SMTP_USER;
    const text =
      `Nuevo lead desde la web de alas\n\n` +
      `Nombre:   ${name}\n` +
      `Email:    ${email}\n` +
      `Telefono: ${phone || '-'}\n` +
      `Perfil:   ${perfil || '-'}\n\n` +
      `Mensaje:\n${mensaje || '-'}\n`;

    const html =
      `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1410;line-height:1.6">` +
      `<h2 style="margin:0 0 2px">Nuevo lead &mdash; agendar llamada</h2>` +
      `<p style="color:#6b6258;margin:0 0 16px;font-size:13px">desde la web de alas</p>` +
      `<table style="border-collapse:collapse;font-size:14px">` +
      `<tr><td style="padding:4px 18px 4px 0;color:#6b6258">Nombre</td><td style="padding:4px 0"><b>${esc(name)}</b></td></tr>` +
      `<tr><td style="padding:4px 18px 4px 0;color:#6b6258">Email</td><td style="padding:4px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>` +
      `<tr><td style="padding:4px 18px 4px 0;color:#6b6258">Telefono</td><td style="padding:4px 0">${esc(phone) || '-'}</td></tr>` +
      `<tr><td style="padding:4px 18px 4px 0;color:#6b6258">Perfil</td><td style="padding:4px 0">${esc(perfil) || '-'}</td></tr>` +
      `</table>` +
      `<p style="margin:16px 0 4px;color:#6b6258;font-size:14px">Mensaje</p>` +
      `<p style="margin:0;white-space:pre-wrap;font-size:14px">${esc(mensaje) || '-'}</p>` +
      `</div>`;

    await transporter.sendMail({
      from: `"alas" <${SMTP_USER}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `Nuevo lead - ${name}${perfil ? ' (' + perfil + ')' : ''}`,
      text,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('lead error:', err);
    return res.status(500).json({ error: 'No se pudo enviar el mensaje' });
  }
};
