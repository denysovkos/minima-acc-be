import * as nodemailer from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';

export class Mailer {
    private static mailerInstance: Mailer;
    private nodemailerMailgun;
    // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
    private auth = {
        auth: {
            api_key: process.env.mg_api,
            domain: 'accountant.in.ua'
        },
    };

    static getInstance() {
        if (!Mailer.mailerInstance) {
            Mailer.mailerInstance = new Mailer();
        }
        return Mailer.mailerInstance;
    }

    private constructor() {
    }

    sendEmail = async (email, token) => {
        if (!this.nodemailerMailgun) {
            this.nodemailerMailgun = await nodemailer.createTransport(mg(this.auth));
        }

        const verificationUrl = `http://localhost:3000/v1/user/validate/${token}`;

        try {
            const result = await this.nodemailerMailgun.sendMail({
                from: 'verify@accauntaint.in.ua',
                to: email,
                subject: 'Verification token',
                html: `<b>For verification click here: <a href=${verificationUrl}>${verificationUrl}</a></b>`,
            });

            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }


}
