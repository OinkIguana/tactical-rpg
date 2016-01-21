'use strict';

import {EmailTemplate} from 'email-templates';
import nodemailer from 'nodemailer';

import generate from './generator';
import {OUR_EMAIL} from './config';

export default (who, templateName, values) => {
    return generate(function*() {
        const template = new EmailTemplate(`./server/email-templates/${templateName}`);
        const message = (yield template.render(values));
        const emailData = {
            from: OUR_EMAIL,
            to: who,
            subject: "RPG: Password reset",
            html: message.html,
            text: message.text
        };
        const transport = nodemailer.createTransport('sendmail');
        yield transport.sendMail(emailData);
    });
};