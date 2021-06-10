import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";

@Injectable()
export class SMTPService {
    private transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    async sendMail(text: string, subject: string, to: string): Promise<void> {
        try {
            await this.transport.sendMail({
                from: process.env.SMTP_EMAIL,
                to,
                subject,
                html: text
            });
        } catch (e) {
            throw new HttpException('Can`t send mail', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    createHtmlLink(path: string, param: string, paramValue: string, text: string): string {
        return `<a href="${1}${path}?${param}=${paramValue}">${text}</a>`;//change 1 to url
    }
}