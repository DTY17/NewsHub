import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jonatan.kulas20@ethereal.email',
        pass: 'Ns8zhePFkPNQD93Hx4'
    }
});

export const send = async (email: string[]) => {
  const info = await transporter.sendMail({
    from: 'dinanthemika.personal@gmail.com',
    to: email,
    subject: "ABC NEws Alert",
    html: "<b>Hello world?</b>", 
  });

  return (info.messageId);
};