import nodemailer from 'nodemailer';
import config from '../../config.js';

const noreplyTransporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_PORT == 465,
  auth: {
    user: config.EMAIL_NOREPLY_USER,
    pass: config.EMAIL_NOREPLY_PASS,
  },
});

const billingTransporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_PORT == 465,
  auth: {
    user: config.EMAIL_BILLING_USER,
    pass: config.EMAIL_BILLING_PASS,
  },
});

export const sendEmail = async (to, subject, otpCode) => {
  console.log('\n=============================================');
  console.log(`🔑 DEV MODE: OTP for ${to} is: ${otpCode}`);
  console.log('=============================================\n');

  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #ef4444; padding: 24px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">InoviumAI Security</h2>
        </div>
        <div style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Please use the verification code below to securely access your account.</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; display: inline-block;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827;">${otpCode}</span>
            </div>
            <p style="font-size: 15px; color: #ef4444; margin-top: 24px; font-weight: 600;">Valid for 5 minutes.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
      </div>
    `;

    const info = await noreplyTransporter.sendMail({
      from: `"InoviumAI Security" <${config.EMAIL_NOREPLY_USER || 'noreply@inoviumai.com'}>`,
      replyTo: config.EMAIL_NOREPLY_USER || 'noreply@inoviumai.com',
      to,
      subject,
      html: htmlTemplate,
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    // Strict Dev Mode Bypass: Only bypass if NO email credentials are provided at all.
    if (!config.EMAIL_NOREPLY_USER) {
      console.warn('⚠️ CRITICAL WARNING: Bypassing email sending because EMAIL_USER is not configured. Do not use in production!');
      return true;
    }

    // In production (with credentials), log the real error and ALWAYS return false
    console.error('Nodemailer Error: Authentication or network issue ->', error.message);
    return false;
  }
};

export const sendPaymentEmail = async (to, paymentDetails) => {
  try {
    const studentName = paymentDetails.studentName || 'Student';
    const courseName = paymentDetails.courseName || 'Web Development Internship';
    const invoiceNumber = paymentDetails.invoiceNumber || `INV-${(paymentDetails.paymentId || '12345').toUpperCase().slice(-8)}`;
    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); background-color: #ffffff; color: #1e293b;">
        <!-- Header / Banner -->
        <div style="background: linear-gradient(135deg, #ef4444 0%, #990000 100%); padding: 35px 40px; color: #ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <span style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">InoviumAI</span>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 4px;">INOVIUM AI PRIVATE LIMITED</div>
              </td>
              <td align="right" valign="top">
                <span style="background-color: #22c55e; color: #ffffff; font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">PAID / CAPTURED</span>
              </td>
            </tr>
          </table>
        </div>

        <div style="padding: 40px;">
          <!-- Meta Details -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
            <tr>
              <td>
                <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 5px 0; color: #0f172a;">TAX INVOICE</h1>
                <span style="color: #64748b; font-size: 13px;">Invoice No: <strong>#${invoiceNumber}</strong></span>
              </td>
              <td align="right" style="color: #64748b; font-size: 13px;">
                Date: <strong>${formattedDate}</strong><br/>
                Payment Method: <strong>Online</strong>
              </td>
            </tr>
          </table>

          <!-- Billed To & From Details -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 40px; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 20px 0;">
            <tr>
              <td width="50%" valign="top">
                <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #ef4444; letter-spacing: 0.5px; margin-bottom: 8px;">Billed To</div>
                <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${studentName}</div>
                <div style="font-size: 13px; color: #475569;">${to}</div>
              </td>
              <td width="50%" valign="top" style="padding-left: 20px;">
                <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 8px;">Issued By</div>
                <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">InoviumAI Private Limited</div>
                <div style="font-size: 12px; color: #475569; line-height: 1.4;">
                  Plot No 428, VGP 2nd Cross Street,<br/>
                  Uthandi, Chennai - 600119<br/>
                  <a href="mailto:billing@inoviumai.com" style="color: #ef4444; text-decoration: none; font-weight: 600;">billing@inoviumai.com</a>
                </div>
              </td>
            </tr>
          </table>

          <!-- Line Items -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th align="left" style="padding: 12px 16px; font-size: 12px; font-weight: bold; color: #64748b; border-bottom: 2px solid #e2e8f0; border-radius: 8px 0 0 8px;">Description</th>
                <th align="right" style="padding: 12px 16px; font-size: 12px; font-weight: bold; color: #64748b; border-bottom: 2px solid #e2e8f0; border-radius: 0 8px 8px 0; width: 120px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 18px 16px; font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
                  ${courseName}
                  <div style="font-size: 12px; font-weight: normal; color: #64748b; margin-top: 4px;">Professional Internship Program & Course Certification</div>
                </td>
                <td align="right" style="padding: 18px 16px; font-size: 15px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
                  ₹${parseFloat(paymentDetails.amount).toLocaleString('en-IN')}.00
                </td>
              </tr>
              <!-- Totals -->
              <tr>
                <td style="padding: 12px 16px 4px 16px; font-size: 13px; color: #64748b;" align="right">Subtotal:</td>
                <td style="padding: 12px 16px 4px 16px; font-size: 13px; font-weight: bold; color: #475569;" align="right">₹${parseFloat(paymentDetails.amount).toLocaleString('en-IN')}.00</td>
              </tr>
              <tr>
                <td style="padding: 4px 16px 4px 16px; font-size: 13px; color: #64748b;" align="right">Tax (GST 0%):</td>
                <td style="padding: 4px 16px 4px 16px; font-size: 13px; font-weight: bold; color: #475569;" align="right">₹0.00</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-size: 15px; font-weight: bold; color: #0f172a; border-top: 1px solid #e2e8f0;" align="right">Total Paid:</td>
                <td style="padding: 12px 16px; font-size: 18px; font-weight: 900; color: #ef4444; border-top: 1px solid #e2e8f0;" align="right">₹${parseFloat(paymentDetails.amount).toLocaleString('en-IN')}.00</td>
              </tr>
            </tbody>
          </table>

          <!-- Transaction Details -->
          <div style="background-color: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 35px;">
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 10px; letter-spacing: 0.5px;">Transaction Reference</div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6;">
              <tr>
                <td width="35%" style="color: #64748b;">Transaction ID:</td>
                <td style="font-family: monospace; font-weight: bold; color: #0f172a;">${paymentDetails.paymentId}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Order ID:</td>
                <td style="font-family: monospace; font-weight: bold; color: #0f172a;">${paymentDetails.orderId}</td>
              </tr>
            </table>
          </div>

          <!-- Bottom CTA -->
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="https://inoviumai.com/dashboard?tab=payments" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: background-color 0.2s;">
              View Dashboard Invoice
            </a>
          </div>

          <div style="text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 40px; border-top: 1px solid #f1f5f9; pt: 20px;">
            This is a computer-generated document and requires no physical signature.<br/>
            Thank you for learning with <strong>InoviumAI</strong>!
          </div>
        </div>
      </div>
    `;

    await billingTransporter.sendMail({
      from: `"InoviumAI Billing" <${config.EMAIL_BILLING_USER || 'billing@inoviumai.com'}>`,
      to,
      subject: "Payment Receipt - InoviumAI",
      html: htmlTemplate,
    });
    return true;
  } catch (error) {
    console.error('Email Error ->', error.message);
    return false;
  }
};

export const sendContactEmail = async (entity, email, subject, reqs) => {
  try {
    const adminEmail = config.EMAIL_USER || 'contact@inoviumai.com';

    // 1. Email to the Admin (InoviumAI team)
    const adminHtmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #ef4444; padding: 24px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">New Contact Request</h2>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">You have received a new contact request from the InoviumAI website.</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 120px; color: #111827;">Entity Name:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #374151;">${entity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #111827;">Email:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #374151;"><a href="mailto:${email}" style="color: #ef4444;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #111827;">Subject:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #374151;">${subject}</td>
              </tr>
            </table>
            <h3 style="font-size: 16px; font-weight: bold; color: #111827; margin-bottom: 8px;">Requirements / Message:</h3>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; color: #374151; white-space: pre-wrap; font-size: 15px;">
              ${reqs}
            </div>
            <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin-top: 30px;">This email was generated securely from your contact form.</p>
        </div>
      </div>
    `;

    // 2. Auto-responder to the User
    const userHtmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Request Received</h2>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Hello ${entity},</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Thank you for reaching out to InoviumAI. We have successfully received your request regarding <strong>"${subject}"</strong>.</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Our engineering team is reviewing your requirements and will get back to you shortly.</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Best regards,<br/>The InoviumAI Team</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; text-align: center;">InoviumAI Private Limited<br/>Plot No 428, VGP 2nd Cross Street, Uthandi, Chennai 600119</p>
        </div>
      </div>
    `;

    // Send to Admin
    await noreplyTransporter.sendMail({
      from: `"InoviumAI Portal" <${config.EMAIL_NOREPLY_USER || 'noreply@inoviumai.com'}>`,
      replyTo: email,
      to: adminEmail,
      subject: `Contact Request: ${subject} - ${entity}`,
      html: adminHtmlTemplate,
    });

    // Send Auto-responder to User (with its own error handling so it doesn't break submission if user email is fake)
    try {
      await noreplyTransporter.sendMail({
        from: `"InoviumAI" <${config.EMAIL_NOREPLY_USER || 'noreply@inoviumai.com'}>`,
        to: email,
        subject: `We've received your request: ${subject}`,
        html: userHtmlTemplate,
      });
    } catch (autoResponderError) {
      console.warn('⚠️ Could not send auto-responder to user email (might be invalid):', autoResponderError.message);
    }

    return true;
  } catch (error) {
    // Strict Dev Mode Bypass: Only bypass if NO email credentials are provided at all.
    if (!config.EMAIL_NOREPLY_USER) {
      console.warn('⚠️ CRITICAL WARNING: Bypassing contact email sending because EMAIL_USER is not configured. Do not use in production!');
      console.log(`Contact Request Received in Dev Mode:\nEntity: ${entity}\nEmail: ${email}\nSubject: ${subject}\nReqs: ${reqs}`);
      return true;
    }
    console.error('Contact Email Error ->', error.message);
    return false;
  }
};
