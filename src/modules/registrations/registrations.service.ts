import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { Attendee } from '../attendees/entities/attendee.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class RegistrationService {
  private readonly cacheKeyPrefix = 'registrations:';

  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const event = await this.entityManager.findOne(Event, { where: { id: createRegistrationDto.event_id } });
    const attendee = await this.entityManager.findOne(Attendee, { where: { id: createRegistrationDto.attendee_id } });
  
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }
    if (!attendee) {
      throw new HttpException('Attendee not found', HttpStatus.NOT_FOUND);
    }
  
    const registrationsCount = await this.entityManager.count(Registration, {
      where: {
        event: { id: createRegistrationDto.event_id },
      },
    });
  
    if (registrationsCount >= event.max_attendees) {
      throw new HttpException('Event registration limit reached', HttpStatus.BAD_REQUEST);
    }
  
    const newRegistration = this.entityManager.create(Registration, { event, attendee });
  
    const savedRegistration = await this.entityManager.save(Registration, newRegistration);
  
    const cacheKey = `${this.cacheKeyPrefix}${createRegistrationDto.event_id}`;
    await this.redisService.deleteCache(cacheKey);
  
    return savedRegistration;
  }
  

  async findByEvent(eventId: string): Promise<Registration[]> {
    const cacheKey = `${this.cacheKeyPrefix}${eventId}`;

    const cachedRegistrations = await this.redisService.getCache<Registration[]>(cacheKey);
    if (cachedRegistrations) {
      return cachedRegistrations;
    }
    const registrations = await this.entityManager.find(Registration, {
      where: { event: { id: eventId } },
      relations: ['event', 'attendee'],
    });

    await this.redisService.setCache(cacheKey, registrations);

    return registrations;
  }

  async remove(id: string): Promise<void> {
    const registration = await this.entityManager.findOne(Registration, {
      where: { id },
      relations: ['event'],
    });

    if (!registration) {
      throw new HttpException('Registration not found', HttpStatus.NOT_FOUND);
    }

    await this.entityManager.remove(Registration, registration);

    const cacheKey = `${this.cacheKeyPrefix}${registration.event.id}`;
    await this.redisService.deleteCache(cacheKey);
  }

  async getAttendeesForMultipleEvents(): Promise<any[]> {
    const query = `
      SELECT 
          attendees.id AS attendee_id,
          attendees.name AS attendee_name,
          attendees.email AS attendee_email,
          COUNT(registrations.id) AS event_count
      FROM 
          attendees
      JOIN 
          registrations ON registrations.attendee_id = attendees.id
      GROUP BY 
          attendees.id
      HAVING 
          COUNT(registrations.id) > 1;
    `;
  
    const result = await this.entityManager.query(query);
  
    if (result.length === 0) {
      throw new HttpException('No attendees found who registered for multiple events', HttpStatus.NOT_FOUND);
    }
  
    return result;
  }

  
}
