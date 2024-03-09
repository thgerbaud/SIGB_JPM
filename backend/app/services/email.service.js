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

exports.inviteAdmin = async (receiver, sender, libraryName) => {
    const info = await transporter.sendMail({
        from: "sigbjpm@gmail.com",
        to: receiver,
        subject: "Invitation à administrer une bibliothèque",
        text: inviteAdminTemplate.text(sender, libraryName),
        html: inviteAdminTemplate.html(sender, libraryName),
    });
    console.log("Message sent: %s", info.messageId);
    return info;
}

exports.inviteGuest = async (receiver, sender, libraryName) => {
    const info = await transporter.sendMail({
        from: "sigbjpm@gmail.com",
        to: receiver,
        subject: "Invitation à rejoindre une bibliothèque",
        text: inviteGuestTemplate.text(sender, libraryName),
        html: inviteGuestTemplate.html(sender, libraryName),
    });
    console.log("Message sent: %s", info.messageId);
    return info;
}