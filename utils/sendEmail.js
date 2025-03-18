import transporter from "../config/nodemailerConfig.js"

async function sendEmail(email,subject,html) {
    await transporter.sendMail({
        from:email,
        to:process.env.ADMIN_EMAIL,
        subject,
        html
    });
}

export default sendEmail