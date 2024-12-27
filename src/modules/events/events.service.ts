import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RedisService } from '../cache/redis.service';
import { WebSocketGatewayService } from '../websocket/websocket.gateway'; 

@Injectable()
export class EventsService {
  private readonly cacheKey = 'events:all';
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly redisService: RedisService,
    private readonly websocketService: WebSocketGatewayService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    const savedEvent = await this.eventRepository.save(event);

    this.websocketService.server.emit('create-event', savedEvent);
    await this.redisService.deleteCache(this.cacheKey);

    return savedEvent;
  }

  async filterByDate(startDate: Date, endDate: Date): Promise<Event[]> {
    const events = await this.eventRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
    });

    if (!events.length) {
      throw new HttpException('No events found in the given date range', HttpStatus.NOT_FOUND);
    }

    return events;
  }
  
  async findAll(): Promise<Event[]> {
    const cachedEvents = await this.redisService.getCache<Event[]>(this.cacheKey);
    if (cachedEvents) {
      return cachedEvents;
    }

    const events = await this.eventRepository.find();
    await this.redisService.setCache(this.cacheKey, events);

    return events;
  }

  async findOne(id: string): Promise<Event | null> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(event, updateEventDto);
    const updatedEvent = await this.eventRepository.save(event);

    await this.redisService.deleteCache(this.cacheKey);

    return updatedEvent;
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    await this.eventRepository.remove(event);
    await this.redisService.deleteCache(this.cacheKey);
  }

  async getEventWithMostRegistrations(): Promise<any> {
    const query = `
      SELECT events.id, events.name, events.date, events.location, COUNT(registrations.id) AS registration_count
      FROM events
      LEFT JOIN registrations ON registrations.event_id = events.id
      GROUP BY events.id
      ORDER BY registration_count DESC
      LIMIT 1;
    `;
  
    try {
      console.log(query, 'Executing query...');
      const result = await this.eventRepository.query(query);
      if (result.length === 0) {
        throw new Error('No events found');
      }
  
      return result[0];
    } catch (error) {
      console.error('Error executing query:', error.message);
      throw error;
    }
  }
  
  
}
