import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedularService } from './scheduler.service';
import { EventReminderTask } from './tasks/event-reminder.task';
import { AttendeesModule } from '../attendees/attendees.module'; 
import { JobModule } from '../background-jobs/jobs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AttendeesModule,
    JobModule,
  ],
  providers: [SchedularService, EventReminderTask],
})
export class SchedularModule {}
