const nodemailer = require('nodemailer');
const config = require('../config/email');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.user,
        pass: config.password
    },
});
const email = async(to) => {
    let info = await transporter.sendMail({
        from: config.user,
        to: to,
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
};

module.exports = email;