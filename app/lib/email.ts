import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOrderConfirmationEmail = async (
  to: string,
  orderId: string,
  orderDetails: {
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    status: string;
  }
) => {
  const itemsHtml = orderDetails.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@fashnova.com',
    to,
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Thank you for your order!</h1>
        <p style="color: #666; font-size: 16px;">Your order has been successfully placed.</p>

        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Status:</strong> ${orderDetails.status}</p>
          <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="color: #666; font-size: 14px;">
          We'll send you another email when your order ships. If you have any questions, please contact our support team.
        </p>

        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
          © 2024 Fashnova. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${to} for order ${orderId}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

export const sendOrderStatusUpdateEmail = async (
  to: string,
  orderId: string,
  newStatus: string,
  trackingNumber?: string
) => {
  let statusMessage = '';
  let additionalInfo = '';

  switch (newStatus) {
    case 'Shipped':
      statusMessage = 'Your order has been shipped!';
      additionalInfo = trackingNumber
        ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>`
        : '';
      break;
    case 'Delivered':
      statusMessage = 'Your order has been delivered!';
      break;
    default:
      statusMessage = `Your order status has been updated to: ${newStatus}`;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@fashnova.com',
    to,
    subject: `Order Update - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Order Status Update</h1>
        <p style="color: #666; font-size: 16px;">${statusMessage}</p>

        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #333; margin-top: 0;">Order Information</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
          ${additionalInfo}
        </div>

        <p style="color: #666; font-size: 14px;">
          You can track your order status in your account dashboard.
        </p>

        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
          © 2024 Fashnova. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${to} for order ${orderId}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};
