const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'timmyhurtful@gmail.com',
                password: 'restart987'
            }
        });
    }

    async sendActivationEmail(to, link) {
        await this.transporter.sendMail({
            from: 'timmyhurtful@gmail.com',
            to,
            subject: 'Активация аккаунта в приложении TakeWord',
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

module.exports = new MailService();