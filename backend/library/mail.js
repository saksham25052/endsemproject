const nodemailer = require('nodemailer');


exports.generateVerificationCode = () => {
    let verificationCode = '';
    const characters = '0123456789';
    for (let i = 0; i < 6; i++) {
      verificationCode += characters.charAt(Math.floor(Math.random() * characters.length));

    }
    return verificationCode;
    }

/*export const sendVerificationCode = async (req, res) =>{
      try {
          const { email } = req.body;
          const user = await User.findById({ email });
  
          if(user.isVerified)
              res.status(400).json({ success: false, message: 'User is already verified' });
       }
       catch(error) {
          res.json({ success: false, message: error.message });
       }
      }
      */
exports.mailTransport =  () => nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILSLURP_EMAIL,
    pass: process.env.MAILSLURP_PASSWORD
  }
});
