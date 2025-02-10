
exports.generateVerificationCode = () => {
    let verificationCode = '';
    const characters = '0123456789';
    for (let i = 0; i < 6; i++) {
      verificationCode += characters.charAt(Math.floor(Math.random() * characters.length));

    }
    return verificationCode;
    }