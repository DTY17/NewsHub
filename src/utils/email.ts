import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // shortcut for Gmail
  auth: {
    user: "dinanthemika.binance@gmail.com", // your Gmail address
    pass: "gmmo jdyo fhhw cmwu", // your Gmail App Password
  },
});

export const send = async (emails: string[]) => {
  try {
    const info = await transporter.sendMail({
      from: "dinanthemika.binance@gmail.com", // should match your authenticated Gmail
      bcc: emails, // use bcc for multiple recipients
      subject: "ABC News Alert",
      html: "<b>Hello world?</b>",
    });

    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);

    return info.response;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
