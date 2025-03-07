const nodemailer = require('nodemailer');
const QRCode = require('qrcode');


exports.generateVerificationCode = () => {
    let verificationCode = '';
    const characters = '0123456789';
    for (let i = 0; i < 6; i++) {
      verificationCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return verificationCode;
};

exports.mailTransport = () => nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILSLURP_EMAIL,
      pass: process.env.MAILSLURP_PASSWORD
    }
});

exports.sendBookingConfirmation = async (userEmail, bookingDetails) => {
    try {
        // First, verify that all required data is present
        if (!bookingDetails || !userEmail) {
            throw new Error('Missing required booking details or email');
        }

        // Create a simpler string-based QR code data
        const qrCodeData = `Event: ${bookingDetails.eventTitle}\nTickets: ${bookingDetails.numberOfTickets}\nEmail: ${userEmail}`;

        console.log('QR Code Data:', qrCodeData); // Debug log

        // Generate QR code with string data
        const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 400,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        const qrCodeBase64 = qrCodeImage.split(',')[1];

        // Rest of your email configuration
        const mailOptions = {
            from: process.env.MAILSLURP_EMAIL,
            to: userEmail,
            subject: 'Booking Confirmation - CountMeIn!',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h1 style="color: #4f46e5; text-align: center; margin-bottom: 30px;">Booking Confirmed! 🎉</h1>
                    
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="cid:qrCode123" alt="Booking QR Code" style="width: 200px; height: 200px;"/>
                        <p style="color: #4b5563; margin-top: 10px;">Show this QR code at the venue</p>
                    </div>

                    <h2 style="color: #1f2937; margin-bottom: 20px;">Event Details:</h2>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong>Event:</strong> ${bookingDetails.eventTitle}</p>
                        <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(bookingDetails.eventDate).toLocaleDateString()}</p>
                        <p style="margin: 10px 0;"><strong>Time:</strong> ${bookingDetails.eventTime}</p>
                        <p style="margin: 10px 0;"><strong>Venue:</strong> ${bookingDetails.venue}</p>
                    </div>

                    <div style="background-color: #eef2ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #1f2937; margin-top: 0;">Booking Summary:</h3>
                        <p style="margin: 10px 0;"><strong>Number of Tickets:</strong> ${bookingDetails.numberOfTickets}</p>
                        <p style="margin: 10px 0;"><strong>Total Amount:</strong> Rs. ${bookingDetails.totalAmount}</p>
                    </div>

                    <div style="text-align: center; color: #4b5563; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="margin-bottom: 10px;">Thank you for booking with CountMeIn!</p>
                        <p style="margin: 0;">We look forward to seeing you at the event.</p>
                    </div>
                </div>
            </div>
        `,
            attachments: [{
                filename: 'qrcode.png',
                content: Buffer.from(qrCodeBase64, 'base64'),
                cid: 'qrCode123'
            }]
        };

        const info = await exports.mailTransport().sendMail(mailOptions);
        console.log('Email sent with QR code:', info.messageId);
        return true;
    } catch (error) {
        console.error('QR Code Generation Error:', {
            error: error.message,
            bookingDetails: JSON.stringify(bookingDetails),
            userEmail
        });
        throw error;
    }
};
