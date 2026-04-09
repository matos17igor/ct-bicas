import nodemailer from "nodemailer";

// Cria o transportador usando as variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatDateBR(isoString: string) {
  return new Date(isoString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function formatTimeBR(isoString: string) {
  return new Date(isoString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

// E-mail para o CLIENTE
export async function sendBookingConfirmedToClient(data: {
  clientName: string;
  clientEmail: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const dateFormatted = formatDateBR(data.date);
  const startFormatted = formatTimeBR(data.startTime);
  const endFormatted = formatTimeBR(data.endTime);

  await transporter.sendMail({
    from: `"CT Bicas 🎾" <${process.env.SMTP_USER}>`,
    to: data.clientEmail,
    subject: `✅ Reserva Confirmada — CT Bicas`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: #c9a227; padding: 28px 32px; text-align: center;">
          <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">🎾 CT BICAS</h1>
          <p style="margin: 6px 0 0; color: #0f172a; font-size: 13px; font-weight: 600; opacity: 0.75; text-transform: uppercase; letter-spacing: 1px;">Reserva Confirmada</p>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 18px; font-weight: 700; margin: 0 0 24px;">Olá, ${data.clientName}! 👋</p>
          <p style="color: #94a3b8; margin: 0 0 28px; font-size: 15px;">Seu horário está reservado. Nos vemos nas quadras!</p>

          <div style="background: #1e293b; border-radius: 12px; padding: 24px; border-left: 4px solid #c9a227;">
            <p style="margin: 0 0 12px; font-size: 14px; color: #94a3b8;">📍 <strong style="color: #e2e8f0;">Quadra:</strong> ${data.courtName}</p>
            <p style="margin: 0 0 12px; font-size: 14px; color: #94a3b8;">📅 <strong style="color: #e2e8f0;">Data:</strong> ${dateFormatted}</p>
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">🕒 <strong style="color: #e2e8f0;">Horário:</strong> ${startFormatted} às ${endFormatted}</p>
          </div>
        </div>

        <div style="padding: 20px 32px; border-top: 1px solid #1e293b; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #334155;">CT Bicas · Arena de Beach Tennis & Futevôlei</p>
        </div>
      </div>
    `,
  });
}

// E-mail simples para o DONO
export async function sendBookingAlertToOwner(data: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return; // Se não configurado, não envia

  const dateFormatted = formatDateBR(data.date);
  const startFormatted = formatTimeBR(data.startTime);

  await transporter.sendMail({
    from: `"CT Bicas Sistema" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `📬 Novo Agendamento — ${data.clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #c9a227;">📬 Novo Agendamento Recebido</h2>
        <p><strong>Cliente:</strong> ${data.clientName}</p>
        <p><strong>E-mail:</strong> ${data.clientEmail}</p>
        <p><strong>Celular:</strong> ${data.clientPhone || "Não informado"}</p>
        <hr style="border-color: #e2e8f0;" />
        <p><strong>Quadra:</strong> ${data.courtName}</p>
        <p><strong>Data:</strong> ${dateFormatted}</p>
        <p><strong>Horário:</strong> ${startFormatted}</p>
      </div>
    `,
  });
}
