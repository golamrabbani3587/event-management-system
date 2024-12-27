import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { RedisService } from '../cache/redis.service';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    WebSocketModule,
  ],
  controllers: [EventsController],
  providers: [RedisService, EventsService],
})
export class EventsModule {}

