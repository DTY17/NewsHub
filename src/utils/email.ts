import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'dinanthemika.binance@gmail.com',
        pass: 'gmmo jdyo fhhw cmwu'
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