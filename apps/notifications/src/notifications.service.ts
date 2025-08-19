import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      // port: 465,
      // secure: true,
      // host: 'gmail',
      // port: 587,
      // secure: false,
      auth: {
        type: 'OAUTH2',
        user: this.configService.get<string>('SMTP_USER'),
        clientId: this.configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get<string>(
          'GOOGLE_OAUTH_CLIENT_SECRET',
        ),
        refreshToken: this.configService.get<string>(
          'GOOGLE_OAUTH_REFRESH_TOKEN',
        ),
      },
    });
  }

  async notifyEmail({ email, text }: NotifyEmailDto): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      to: email,
      subject: 'Sleepr Notification',
      text,
    });
  }
}
