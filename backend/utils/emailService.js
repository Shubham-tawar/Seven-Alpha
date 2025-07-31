const nodemailer = require('nodemailer');

/**
 * Email service for sending emails
 * Uses environment variables for configuration
 */
const sendEmail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"7 ALPHA" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Email could not be sent');
  }
};

/**
 * Send order confirmation email
 * @param {Object} orderData - Order data including customer info, items, and shipping details
 */
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { 
      user, 
      order, 
      orderItems,
      shippingAddress,
      billingAddress 
    } = orderData;

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };

    // Generate items HTML
    const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name} ${item.variantName ? `(${item.variantName})` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${formatCurrency(item.price)}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${formatCurrency(item.price * item.quantity)}
        </td>
      </tr>
    `).join('');

    // Read the email template
    const fs = require('fs');
    const path = require('path');
    let template;
    
    try {
      // Try to read the template file
      const templatePath = path.join(__dirname, '../templates/orderEmail.html');
      template = fs.readFileSync(templatePath, 'utf8');
    } catch (err) {
      console.warn('Could not read email template file, using inline template instead:', err);
      // Fallback to inline template if file can't be read
      template = getInlineEmailTemplate();
    }
    
    // Replace template variables
    const html = template
      .replace('{{customerName}}', `${user.firstName} ${user.lastName}`)
      .replace('{{orderNumber}}', order.orderNumber)
      .replace('{{orderDate}}', new Date(order.orderDate).toLocaleDateString())
      .replace('{{paymentMethod}}', order.paymentMethod)
      .replace('{{orderItems}}', itemsHtml)
      .replace('{{subtotal}}', formatCurrency(order.subtotal))
      .replace('{{shipping}}', formatCurrency(order.shippingAmount))
      .replace('{{tax}}', formatCurrency(order.taxAmount))
      .replace('{{total}}', formatCurrency(order.totalAmount))
      .replace('{{shippingName}}', shippingAddress.fullName)
      .replace('{{shippingAddress1}}', shippingAddress.addressLine1)
      .replace('{{shippingAddress2}}', shippingAddress.addressLine2 || '')
      .replace('{{shippingCity}}', shippingAddress.city)
      .replace('{{shippingState}}', shippingAddress.state)
      .replace('{{shippingZip}}', shippingAddress.postalCode)
      .replace('{{shippingCountry}}', shippingAddress.country)
      .replace('{{orderStatusUrl}}', `${process.env.NODE_ENV === 'production' ? 'https://7alpha.com' : 'http://localhost:5000'}/src/pages/account/orders.html?order_id=${order.id}`)
      .replace('{{currentYear}}', new Date().getFullYear().toString())
      // Handle conditional discount section
      .replace(
        /\{\{#if discount\}\}([\s\S]*?)\{\{\/if\}\}/g, 
        order.discountAmount > 0 ? 
          `<tr>
            <td>Discount:</td>
            <td style="text-align: right;">-${formatCurrency(order.discountAmount)}</td>
          </tr>` : 
          ''
      );

    // Send the email
    await sendEmail({
      email: user.email,
      subject: `7 ALPHA - Order Confirmation #${order.orderNumber}`,
      html: html
    });

    console.log(`Order confirmation email sent to ${user.email} for order ${order.orderNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

/**
 * Get inline email template as fallback
 * @returns {string} HTML email template
 */
const getInlineEmailTemplate = () => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 3px solid #000;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #000;
          letter-spacing: 2px;
        }
        .order-info {
          background-color: #f5f5f5;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-top: 25px;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #f5f5f5;
          padding: 10px;
          text-align: left;
        }
        .summary-table td {
          padding: 5px 10px;
        }
        .total-row {
          font-weight: bold;
          font-size: 16px;
          border-top: 2px solid #000;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #777;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          background-color: #000;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">7 ALPHA</div>
          <div>Order Confirmation</div>
        </div>
        
        <p>Dear {{customerName}},</p>
        
        <p>Thank you for your purchase! We're excited to confirm that your order has been received and is being processed.</p>
        
        <div class="order-info">
          <strong>Order Number:</strong> {{orderNumber}}<br>
          <strong>Order Date:</strong> {{orderDate}}<br>
          <strong>Payment Method:</strong> {{paymentMethod}}
        </div>
        
        <div class="section-title">Order Summary</div>
        
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            {{orderItems}}
          </tbody>
        </table>
        
        <table class="summary-table" style="margin-top: 20px; margin-left: auto; width: 250px;">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">{{subtotal}}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td style="text-align: right;">{{shipping}}</td>
          </tr>
          {{#if discount}}
          <tr>
            <td>Discount:</td>
            <td style="text-align: right;">-{{discount}}</td>
          </tr>
          {{/if}}
          <tr>
            <td>Tax:</td>
            <td style="text-align: right;">{{tax}}</td>
          </tr>
          <tr class="total-row">
            <td>Total:</td>
            <td style="text-align: right;">{{total}}</td>
          </tr>
        </table>
        
        <div class="section-title">Shipping Address</div>
        <p>
          {{shippingName}}<br>
          {{shippingAddress1}}<br>
          {{#if shippingAddress2}}{{shippingAddress2}}<br>{{/if}}
          {{shippingCity}}, {{shippingState}} {{shippingZip}}<br>
          {{shippingCountry}}
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="{{orderStatusUrl}}" class="button">View Order Status</a>
        </div>
        
        <div class="footer">
          <p>If you have any questions about your order, please contact our customer service at support@7alpha.com</p>
          <p>&copy; {{currentYear}} 7 ALPHA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail
};