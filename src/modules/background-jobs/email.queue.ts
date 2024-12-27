import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailQueue {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async sendConfirmationEmail(data: { email: string; name: string }) {
    await this.emailQueue.add('send-confirmation', data, {
      attempts: 3,
      backoff: 5000,
    });
  }
}
