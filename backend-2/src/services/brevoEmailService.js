const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@icee2026.com'; // Update this with your verified Brevo sender email
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'ICEE 2026';
const BREVO_API_URL = 'https://api.brevo.com/v3';

/**
 * Send transactional email via Brevo
 * @param {string} toEmail - Recipient email address
 * @param {string} toName - Recipient name
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {string} uniqueId - Unique registration ID to include in email
 * @returns {Promise<Object>} Brevo API response
 */
async function sendSeminarRegistrationEmail(toEmail, toName, uniqueId, jenisPeserta) {
  try {
    const subject = 'Konfirmasi Pendaftaran Seminar ICEE 2026';
    
    // Determine participant type text
    const participantType = jenisPeserta === 'Umum' 
      ? 'Umum' 
      : (jenisPeserta === 'Mahasiswa TPB ITB' ? 'Mahasiswa TPB ITB' : 'Anggota HMS ITB');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #0066cc;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .unique-id {
            background-color: #fff;
            border: 2px solid #0066cc;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .unique-id-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          .unique-id-value {
            font-size: 32px;
            font-weight: bold;
            color: #0066cc;
            letter-spacing: 2px;
          }
          .info-section {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff;
            border-left: 4px solid #0066cc;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Konfirmasi Pendaftaran Seminar ICEE 2026</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${toName}</strong>,</p>
          
          <p>Terima kasih telah mendaftar untuk Seminar ICEE 2026!</p>
          
          <div class="unique-id">
            <div class="unique-id-label">Kode Pendaftaran Anda:</div>
            <div class="unique-id-value">${uniqueId}</div>
          </div>
          
          <div class="info-section">
            <p><strong>Jenis Peserta:</strong> ${participantType}</p>
            <p><strong>Kode Pendaftaran:</strong> ${uniqueId}</p>
          </div>
          
          <p>Mohon simpan kode pendaftaran ini dengan baik, karena kode ini akan digunakan untuk verifikasi kehadiran Anda pada hari acara.</p>
          
          <p>Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi kami.</p>
          
          <p>Salam hangat,<br>
          <strong>Panitia ICEE 2026</strong></p>
        </div>
        <div class="footer">
          <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
          <p>&copy; 2026 ICEE. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const response = await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL
        },
        to: [
          {
            email: toEmail,
            name: toName
          }
        ],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      messageId: response.data.messageId,
      uniqueId: uniqueId
    };
  } catch (error) {
    console.error('[Brevo Email Service] Error sending email:', error.response?.data || error.message);
    throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Send payment confirmation email via Brevo (after payment verification by ICEE staff)
 * @param {string} toEmail - Recipient email address
 * @param {string} toName - Recipient name
 * @param {string} uniqueId - Unique registration ID
 * @param {string} qrCodeLink - QR code link for event day (one-time use)
 * @returns {Promise<Object>} Brevo API response
 */
async function sendPaymentConfirmationEmail(toEmail, toName, uniqueId, qrCodeLink) {
  try {
    const subject = 'Konfirmasi Pembayaran - Seminar ICEE 2026';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #0066cc;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .success-badge {
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
          }
          .info-section {
            background-color: #fff;
            border: 2px solid #0066cc;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-section h3 {
            margin-top: 0;
            color: #0066cc;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
          }
          .info-row {
            margin: 15px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 4px solid #0066cc;
          }
          .info-label {
            font-weight: bold;
            color: #666;
            display: block;
            margin-bottom: 5px;
          }
          .info-value {
            color: #333;
            font-size: 16px;
          }
          .unique-id {
            background-color: #fff;
            border: 2px solid #0066cc;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            margin: 15px 0;
          }
          .unique-id-value {
            font-size: 28px;
            font-weight: bold;
            color: #0066cc;
            letter-spacing: 2px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
            font-weight: bold;
            text-align: center;
          }
          .button:hover {
            background-color: #0052a3;
          }
          .button-whatsapp {
            background-color: #25D366;
          }
          .button-whatsapp:hover {
            background-color: #20BA5A;
          }
          .qr-section {
            background-color: #fff;
            border: 2px dashed #0066cc;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .qr-section p {
            color: #d9534f;
            font-weight: bold;
            margin-top: 10px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Konfirmasi Pembayaran Seminar ICEE 2026</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${toName}</strong>,</p>
          
          <div class="success-badge">
            ✓ Pembayaran Anda telah dikonfirmasi!
          </div>
          
          <p>Terima kasih! Pembayaran Anda untuk <strong>Seminar ICEE 2026</strong> telah berhasil diverifikasi oleh panitia.</p>
          
          <div class="info-section">
            <h3>Identitas Peserta</h3>
            <div class="info-row">
              <span class="info-label">Nama Peserta:</span>
              <span class="info-value">${toName}</span>
            </div>
            <div class="unique-id">
              <div class="info-label">ID Peserta:</div>
              <div class="unique-id-value">${uniqueId}</div>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Informasi Acara</h3>
            <div class="info-row">
              <span class="info-label">Waktu & Tempat:</span>
              <span class="info-value">
                <strong>Aula Barat Kampus Ganesha ITB</strong><br>
                <a href="https://share.google/h24B6GbzgsY1ePVJI" target="_blank" style="color: #0066cc;">
                  Lihat Lokasi di Google Maps
                </a>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Jam Buka Gerbang:</span>
              <span class="info-value"><strong>09:00 WIB</strong></span>
            </div>
          </div>
          
          <div class="highlight">
            <strong>⚠️ Penting:</strong> Pastikan Anda datang tepat waktu. Gerbang akan dibuka pada pukul 09:00 WIB.
          </div>
          
          <div class="info-section">
            <h3>Group WhatsApp</h3>
            <p>Bergabunglah dengan Group WhatsApp peserta untuk mendapatkan informasi terbaru dan berinteraksi dengan peserta lainnya:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://chat.whatsapp.com/FU0uA4CejYjGI2TA7t4CcF" target="_blank" class="button button-whatsapp">
                📱 Join Group WhatsApp
              </a>
            </div>
          </div>
          
          <div class="qr-section">
            <h3 style="color: #0066cc; margin-top: 0;">QR Code untuk Hari H</h3>
            <p style="margin-bottom: 15px;">Gunakan QR code berikut untuk verifikasi kehadiran pada hari acara:</p>
            <div style="margin: 20px 0;">
              <a href="${qrCodeLink}" target="_blank" class="button" style="display: inline-block;">
                📱 Buka QR Code
              </a>
            </div>
            <p style="color: #d9534f; font-weight: bold; margin-top: 15px;">
              ⚠️ QR Code ini hanya dapat digunakan 1 kali pada hari H
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              Simpan link QR code ini dengan baik dan jangan bagikan kepada siapapun.
            </p>
          </div>
          
          <div class="info-section">
            <h3>Informasi Penting</h3>
            <ul style="line-height: 2;">
              <li>Pastikan Anda membawa <strong>ID Peserta (${uniqueId})</strong> atau menunjukkan email ini pada hari acara</li>
              <li>QR Code hanya dapat digunakan <strong>1 kali</strong> pada hari H</li>
              <li>Bergabung dengan Group WhatsApp untuk informasi terbaru</li>
              <li>Datang tepat waktu, gerbang dibuka pukul <strong>09:00 WIB</strong></li>
            </ul>
          </div>
          
          <p>Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi kami melalui Group WhatsApp atau email.</p>
          
          <p>Salam hangat,<br>
          <strong>Panitia ICEE 2026</strong></p>
        </div>
        <div class="footer">
          <p>Email ini dikirim setelah verifikasi pembayaran oleh panitia ICEE 2026.</p>
          <p>Mohon tidak membalas email ini. Untuk pertanyaan, hubungi kami melalui Group WhatsApp.</p>
          <p>&copy; 2026 ICEE. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const response = await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL
        },
        to: [
          {
            email: toEmail,
            name: toName
          }
        ],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      messageId: response.data.messageId,
      uniqueId: uniqueId
    };
  } catch (error) {
    console.error('[Brevo Email Service] Error sending payment confirmation email:', error.response?.data || error.message);
    throw new Error(`Failed to send payment confirmation email: ${error.response?.data?.message || error.message}`);
  }
}

module.exports = {
  sendSeminarRegistrationEmail,
  sendPaymentConfirmationEmail
};
