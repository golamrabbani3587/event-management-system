import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { EntityManager } from 'typeorm';
import * as moment from 'moment';

@Processor('email')
export class EmailProcessor {
  private readonly transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SEND_GRID_KEY,
    },
  });

  constructor(private readonly entityManager: EntityManager) {}

  public async sendEmail(
    email: string,
    name: string,
    eventTitle: string,
    eventDate: Date,
  ): Promise<void> {
    const subject = `Reminder: Event "${eventTitle}" Starts Soon`;
    const text = `Hi ${name},\n\nThis is a reminder that the event "${eventTitle}" will take place on ${moment(
      eventDate,
    ).format('LLLL')}.\n\nLooking forward to seeing you there!\n\nBest regards,\nEvent Team`;

    try {
      await this.transporter.sendMail({
        from: '"Event Management" <golamrabbani3587@gmail.com>',
        to: email,
        subject,
        text,
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}`, error);
      throw error;
    }
  }

  @Process('send-confirmation')
  async handleSendConfirmation(job: Job<{ email: string; name: string }>) {
    const { email, name } = job.data;

    const eventTitle = 'Event Registration';
    const eventDate = new Date();

    await this.sendEmail(email, name, eventTitle, eventDate);
  }

  @Process('send-reminder')
  async handleSendReminders() {
    const now = moment();
    const next24Hours = now.add(24, 'hours');

    const events = await this.entityManager
      .createQueryBuilder('Event', 'event')
      .where('event.date BETWEEN :start AND :end', {
        start: now.toDate(),
        end: next24Hours.toDate(),
      })
      .getMany();

    for (const event of events) {
      const registrations = await this.entityManager
        .createQueryBuilder('Registration', 'registration')
        .leftJoinAndSelect('registration.attendee', 'attendee')
        .where('registration.eventId = :eventId', { eventId: event.id })
        .getMany();

      for (const registration of registrations) {
        const attendee = registration.attendee;
        await this.sendEmail(attendee.email, attendee.name, event.name, event.date);
      }
    }
  }
}
