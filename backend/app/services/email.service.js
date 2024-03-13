const nodemailer = require('nodemailer');

const inviteAdminTemplate = require('./templates/inviteAdmin.template');
const inviteGuestTemplate = require('./templates/inviteGuest.template');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PWD,
    },
});

exports.inviteAdmin = async (receiver, sender, library, code) => {
    try {
        const info = await transporter.sendMail({
            from: "sigbjpm@gmail.com",
            to: receiver,
            subject: "Invitation à administrer une bibliothèque",
            text: inviteAdminTemplate.text(sender, library, code),
            html: inviteAdminTemplate.html(sender, library, code),
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (err) {
        console.error(err);
        return null;
    }
}

exports.inviteGuest = async (receiver, sender, library, code) => {
    try {
        const info = await transporter.sendMail({
            from: "sigbjpm@gmail.com",
            to: receiver,
            subject: "Invitation à rejoindre une bibliothèque",
            text: inviteGuestTemplate.text(sender, library, code),
            html: inviteGuestTemplate.html(sender, library, code),
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (err) {
        console.error(err);
        return null;
    }
}