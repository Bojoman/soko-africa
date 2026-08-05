import fp from 'fastify-plugin';
import nodemailer from 'nodemailer';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST || process.env.SMTP_URL);
}

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY) || hasSmtpConfig();
}

function buildSmtpTransport() {
  if (process.env.SMTP_URL) {
    return nodemailer.createTransport(process.env.SMTP_URL);
  }
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined
    });
  }
  return nodemailer.createTransport({ jsonTransport: true });
}

function fromAddress() {
  if (process.env.RESEND_API_KEY) {
    return process.env.RESEND_FROM || 'SokoAfrica Support <support@sokoafrica.com>';
  }
  return process.env.MAIL_FROM || 'SokoAfrica Support <support@sokoafrica.com>';
}

function appUrl(path = '') {
  const base = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]
  );
}

export default fp(async (fastify) => {
  const enabled = isConfigured() || process.env.NODE_ENV !== 'production';
  const transport = buildSmtpTransport();

  fastify.decorate('mail', {
    enabled,

    async send({ to, subject, text, html }) {
      if (!to) return { skipped: true };

      if (process.env.RESEND_API_KEY) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress(),
            to: [to],
            subject,
            text,
            html
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || `Resend request failed (${response.status})`);
        }
        return result;
      }

      const info = await transport.sendMail({
        from: fromAddress(),
        to,
        subject,
        text,
        html
      });
      if (!isConfigured()) {
        fastify.log.info({ to, subject, preview: info.message }, 'Mail (dev jsonTransport)');
      }
      return info;
    },

    async sendWelcome(user) {
      const name = String(user.firstName || '').trim();
      const greeting = name ? `Hi ${name},` : 'Hi,';
      const htmlGreeting = name ? `Hi ${escapeHtml(name)},` : 'Hi,';
      const destination = user.role === 'SELLER' ? '/sell?apply=true' : '/account';
      const action = user.role === 'SELLER'
        ? 'Complete your seller profile'
        : 'View your account';
      const link = appUrl(destination);
      const subject = 'Welcome to SokoAfrica';
      const text = `${greeting}\n\nYour SokoAfrica account is ready.\n\n${action}: ${link}`;
      const html = `<p>${htmlGreeting}</p><p>Your SokoAfrica account is ready.</p><p><a href="${link}">${action}</a></p>`;
      return this.send({ to: user.email, subject, text, html });
    },

    async sendPasswordReset(to, token) {
      const link = appUrl(`/auth/reset-password?token=${encodeURIComponent(token)}`);
      const subject = 'Reset your SokoAfrica password';
      const text = `Reset your password: ${link}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`;
      const html = `<p>Reset your SokoAfrica password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour.</p>`;
      return this.send({ to, subject, text, html });
    },

    async sendOrderConfirmation(order) {
      const to = order.email;
      if (!to) return { skipped: true };
      const lines = (order.items || [])
        .map((it) => `• ${it.productName || it.name} × ${it.quantity} — ${order.currency || 'USD'} ${Number(it.subtotal ?? it.price * it.quantity).toFixed(2)}`)
        .join('\n');
      const subject = `Order confirmed — ${order.id.slice(0, 8).toUpperCase()}`;
      const text = `Thank you for your order!\n\nOrder: ${order.id}\nTotal: ${order.currency || 'USD'} ${Number(order.total).toFixed(2)}\n\nItems:\n${lines}\n\nTrack your order: ${appUrl(`/orders/${order.id}`)}`;
      const html = `<h2>Thank you for your order</h2><p><strong>Order:</strong> ${order.id}</p><p><strong>Total:</strong> ${order.currency || 'USD'} ${Number(order.total).toFixed(2)}</p><pre>${lines}</pre><p><a href="${appUrl(`/orders/${order.id}`)}">View order status</a></p>`;
      return this.send({ to, subject, text, html });
    }
  });

  fastify.log.info(
    {
      mode: process.env.RESEND_API_KEY
        ? 'resend'
        : hasSmtpConfig()
          ? 'smtp'
          : 'jsonTransport (dev)'
    },
    'Mail plugin ready'
  );
});
