import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SchedularService {
  private readonly logger = new Logger(SchedularService.name);

  handleReminders() {
    this.logger.log('Event reminders processing started.');
  }
}
