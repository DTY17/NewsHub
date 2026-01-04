import nodemailer from "nodemailer";

// ✅ Transporter configured for Gmail with App Password
const transporter = nodemailer.createTransport({
  service: "gmail", // shortcut for Gmail
  auth: {
    user: "dinanthemika.binance@gmail.com", // your Gmail address
    pass: "gmmo jdyo fhhw cmwu", // Gmail App Password (not your normal password)
  },
});

// ✅ Send function
export const send = async (emails: string[], id: string, topic: string) => {
  try {
    const info = await transporter.sendMail({
      from: "dinanthemika.binance@gmail.com", // must match auth user
      bcc: emails, // use bcc for multiple recipients
      subject: "ABC News Alert",
      html: `
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ABC News Alert</title>
        </head>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f3f4f6;">
          <table width="100%" style="background-color:#f3f4f6;">
            <tr>
              <td style="padding:20px 0;">
                <table width="600" style="margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#312e81 0%,#7c3aed 50%,#ec4899 100%);padding:32px 40px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">📰 ABC NEWS</h1>
                      <p style="margin:8px 0 0;color:#e0d5f7;font-size:14px;">Breaking News Alert</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 40px;">
                      <h2 style="margin:0;color:#1f2937;font-size:24px;font-weight:bold;">Global Climate Summit Reaches Historic Agreement</h2>
                      <p style="margin:16px 0;color:#4b5563;font-size:16px;line-height:1.6;">
                        ${topic}.
                      </p>
                      <div style="text-align:center;margin-top:20px;">
                        <a href="https://newshub-front-end.vercel.app/home/post/${id}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">
                          Read Full Story →
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
                      <p style="margin:0;color:#6b7280;font-size:14px;">© 2026 ABC News. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // ✅ Log delivery status
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
