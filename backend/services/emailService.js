import nodemailer from "nodemailer";

// Create reusable transporter
// Configure in .env: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const fromEmail = () => process.env.EMAIL_FROM || "Safetyc <noreply@safetyc.in>";

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmation(booking) {
  if (!process.env.EMAIL_USER) {
    console.log("[Email] EMAIL_USER not configured, skipping email");
    return false;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: fromEmail(),
      to: booking.customer.email,
      subject: `Booking Confirmed - ${booking.bookingNumber} | Safetyc`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .booking-number { background: #fef3c7; color: #92400e; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; }
    .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .details h3 { margin-top: 0; color: #4b5563; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { color: #6b7280; }
    .detail-value { font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .cta-button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Safetyc</h1>
      <p>Booking Confirmation</p>
    </div>
    <div class="content">
      <p>Dear <strong>${booking.customer.name}</strong>,</p>
      <p>Thank you for choosing Safetyc! Your service booking has been received and is being processed.</p>
      
      <div class="booking-number">
        Booking Number: ${booking.bookingNumber}
      </div>
      
      <div class="details">
        <h3>📋 Booking Details</h3>
        <div class="detail-row">
          <span class="detail-label">Service:</span>
          <span class="detail-value">${booking.service.type}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Site Type:</span>
          <span class="detail-value">${booking.site?.type || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${booking.site?.location || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value" style="color: #f97316;">Pending Review</span>
        </div>
      </div>
      
      <p>Our team will review your request and contact you at <strong>${booking.customer.phone}</strong> within 24 hours to discuss the next steps.</p>
      
      <p style="text-align: center;">
        <a href="https://safetyc.in/track-booking?id=${booking.bookingNumber}" class="cta-button">
          Track Your Booking
        </a>
      </p>
    </div>
    <div class="footer">
      <p>Safetyc - Your Safety Partner</p>
      <p>📞 Contact: +91-99073 71539 | ✉️ mssafetyc@gmail.com</p>
    </div>
  </div>
</body>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Booking confirmation sent to ${booking.customer.email}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send booking confirmation:", error);
    return false;
  }
}

/**
 * Send status update email to customer
 */
export async function sendStatusUpdate(booking, newStatus, message = "") {
  if (!process.env.EMAIL_USER) {
    console.log("[Email] EMAIL_USER not configured, skipping email");
    return false;
  }

  const statusMessages = {
    confirmed: "Your booking has been confirmed! Our team will contact you shortly.",
    assigned: `A technician has been assigned to your job.${booking.scheduledDate ? ` Scheduled for: ${new Date(booking.scheduledDate).toLocaleDateString()}` : ""}`,
    "in-progress": "Work on your service has started!",
    completed: "Your service has been completed. We'd love to hear your feedback!",
    cancelled: "Your booking has been cancelled. If this was unexpected, please contact us."
  };

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: fromEmail(),
      to: booking.customer.email,
      subject: `Booking Update - ${booking.bookingNumber} | Safetyc`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
    .message-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Safetyc</h1>
      <p>Booking Status Update</p>
    </div>
    <div class="content">
      <p>Dear <strong>${booking.customer.name}</strong>,</p>
      
      <p>Your booking <strong>${booking.bookingNumber}</strong> has been updated:</p>
      
      <p style="text-align: center; margin: 25px 0;">
        <span class="status-badge">${newStatus.replace("-", " ")}</span>
      </p>
      
      <div class="message-box">
        ${statusMessages[newStatus] || message || "Your booking status has been updated."}
      </div>
      
      ${newStatus === "completed" ? `
      <p style="text-align: center;">
        <a href="https://safetyc.in/feedback/${booking._id}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
          Share Your Feedback
        </a>
      </p>
      ` : ""}
    </div>
    <div class="footer">
      <p>Safetyc - Your Safety Partner</p>
    </div>
  </div>
</body>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Status update sent to ${booking.customer.email}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send status update:", error);
    return false;
  }
}

/**
 * Send feedback request email
 */
export async function sendFeedbackRequest(booking, workOrder) {
  if (!process.env.EMAIL_USER) {
    console.log("[Email] EMAIL_USER not configured, skipping email");
    return false;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: fromEmail(),
      to: booking.customer.email,
      subject: `How was your experience? - ${booking.bookingNumber} | Safetyc`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; text-align: center; }
    .stars { font-size: 40px; margin: 20px 0; }
    .cta-button { display: inline-block; background: #f97316; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Service Completed!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${booking.customer.name}</strong>,</p>
      
      <p>We hope you're satisfied with our ${booking.service.type} service!</p>
      
      <div class="stars">⭐⭐⭐⭐⭐</div>
      
      <p>Your feedback helps us improve and serve you better.</p>
      
      <p style="margin: 30px 0;">
        <a href="https://safetyc.in/feedback/${booking._id}" class="cta-button">
          Rate Your Experience
        </a>
      </p>
      
      <p style="color: #6b7280; font-size: 14px;">It only takes 30 seconds!</p>
    </div>
    <div class="footer">
      <p>Thank you for choosing Safetyc!</p>
    </div>
  </div>
</body>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Feedback request sent to ${booking.customer.email}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send feedback request:", error);
    return false;
  }
}
