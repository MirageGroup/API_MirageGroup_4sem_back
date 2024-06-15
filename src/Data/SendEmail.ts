import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function SendEmail(destinatario: string, assunto: string, corpo: string) {
  const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASSWORD,
      },
    });

  try {
      // Enviando o email
      console.log(destinatario)
      await transporter.sendMail({
        from: process.env.TRANSPORTER_EMAIL, // Remover as aspas para usar a variável corretamente
        to: destinatario,
        subject: assunto,
        text: corpo,
      });
      console.log('Email enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar o email:', error);
    }
}
