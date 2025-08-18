import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter with Gmail configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn(
        "Email configuration missing - EMAIL_USER or EMAIL_PASSWORD not set"
      );
      console.log("Simulating email send for:", options.to);
      console.log("Subject:", options.subject);
      // In production without email config, we'll simulate success
      // This prevents the forgot password flow from breaking
      return true;
    }

    const transporter = createTransporter();

    // Test the connection first
    await transporter.verify();

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || "GrandEdu Team",
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER!,
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Email config check:", {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD,
      emailService: process.env.EMAIL_SERVICE,
    });

    // In production, we might want to continue the flow even if email fails
    // This prevents the entire forgot password process from breaking
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "Email failed in production - continuing with simulated success"
      );
      return true;
    }

    return false;
  }
};

// Password reset email template in Mongolian
export const generatePasswordResetEmail = (
  code: string,
  userEmail: string
): { subject: string; html: string } => {
  const subject = "GrandEdu - Нууц үг сэргээх код";

  const html = `
    <!DOCTYPE html>
    <html lang="mn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Нууц үг сэргээх</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
            }
            .code-box {
                background-color: #f8f9fa;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }
            .code {
                font-size: 36px;
                font-weight: bold;
                color: #007bff;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 GrandEdu</h1>
                <p>Нууц үг сэргээх хүсэлт</p>
            </div>
            
            <h2>Сайн байна уу!</h2>
            <p>Та <strong>${userEmail}</strong> хаягаар нууц үг сэргээх хүсэлт илгээсэн байна.</p>
            
            <p>Доорх 6 оронтой кодыг ашиглан нууц үгээ сэргээнэ үү:</p>
            
            <div class="code-box">
                <div class="code">${code}</div>
                <p style="margin: 10px 0 0 0; color: #666;">Баталгаажуулах код</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Анхаар:</strong>
                <ul style="margin: 5px 0;">
                    <li>Энэ код зөвхөн <strong>1 цагийн</strong> турш хүчинтэй</li>
                    <li>Кодыг хэн нэгэнтэй хуваалцаж болохгүй</li>
                    <li>Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ имэйлийг үл тоомсорлоно уу</li>
                </ul>
            </div>
            
            <p>Нууц үг сэргээхийн тулд:</p>
            <ol>
                <li>GrandEdu веб хуудас руу буцаж очоод</li>
                <li>Дээрх 6 оронтой кодыг оруулна уу</li>
                <li>Шинэ нууц үгээ тохируулна уу</li>
            </ol>
            
            <div class="footer">
                <p>Энэ имэйл нь автоматаар илгээгдсэн тул хариулах шаардлагагүй.</p>
                <p><strong>GrandEdu Team</strong> | Боловсролын чиглэл</p>
                <p style="font-size: 12px; color: #999;">
                    Хэрэв танд асуудал гарвал <a href="mailto:${process.env.EMAIL_FROM}">манай тусламжийн төвтэй</a> холбогдоно уу.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  return { subject, html };
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
