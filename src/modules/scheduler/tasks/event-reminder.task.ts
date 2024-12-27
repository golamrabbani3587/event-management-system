import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EntityManager } from 'typeorm';
import * as moment from 'moment';
import { EmailProcessor } from '../../background-jobs/email.processor';

@Injectable()
export class EventReminderTask {
  private readonly logger = new Logger(EventReminderTask.name);

  constructor(
    private readonly entityManager: EntityManager,
    private readonly emailProcessor: EmailProcessor,
  ) {}

  // @Cron('*/ * * * *')
  @Cron('0 * * * *')
  async sendEventReminders() {
    this.logger.log('Running event reminder task.');

    const now = moment();
    const next24Hours = moment().add(24, 'hours');

    try {
      const registrations = await this.entityManager
      .createQueryBuilder('Registration', 'registration')
      .leftJoinAndSelect('registration.attendee', 'attendee')
      .leftJoinAndSelect('registration.event', 'event')
      .where('event.date BETWEEN :start AND :end', {
        start: now.toDate(),
        end: next24Hours.toDate(),
      })
      .getMany();

        console.log(registrations, 'this is registrations');
        
      for (const registration of registrations) {
        const attendee = registration.attendee;
        const eventTitle = registration.event.name;
        const eventDate = registration.event.date;
        await this.emailProcessor.sendEmail(
          attendee.email,
          attendee.name,
          eventTitle,
          eventDate,
        );
      }

      this.logger.log('Event reminders sent successfully.');
    } catch (error) {
      this.logger.error('Failed to send event reminders', error.stack);
    }
  }
}
