import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeesController } from './attendees.controller';
import { AttendeesService } from './attendees.service';
import { Attendee } from './entities/attendee.entity';
import { RedisService } from '../cache/redis.service';
import { BullModule } from '@nestjs/bull';
import { EmailQueue } from '../background-jobs/email.queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendee]), 
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [AttendeesController],
  providers: [AttendeesService, RedisService, EmailQueue],
})
export class AttendeesModule {}

