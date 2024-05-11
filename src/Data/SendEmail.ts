import nodemailer from 'nodemailer';
import dotenv from 'dotenv';



export default async function SendEmail(destinatario: string, assunto: string, corpo: string) {
    console.log(process.env.TRANSPORTER_PASSWORD,)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.TRANSPORTER_EMAIL,
          pass: process.env.TRANSPORTER_PASSWORD,
        },
      });
    try {
        // Enviando o email
        await transporter.sendMail({
          from: 'gustavohpa2003@gmail.com',
          to: destinatario,
          subject: assunto,
          text: corpo,
        });
        console.log('Email enviado com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar o email:', error);
      }
}