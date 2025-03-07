const QRCode = require('qrcode');

const testQR = async () => {
    try {
        const buffer = await QRCode.toBuffer('test data');
        console.log('QR Code generated successfully:', buffer.length, 'bytes');
    } catch (error) {
        console.error('QR Code generation failed:', error);
    }
};

testQR();