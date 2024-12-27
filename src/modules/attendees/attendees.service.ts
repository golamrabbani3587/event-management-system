import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Between, Repository } from 'typeorm';
import { Attendee } from './entities/attendee.entity';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { RedisService } from '../cache/redis.service';
import { EmailQueue } from '../background-jobs/email.queue';

@Injectable()
export class AttendeesService {
  private readonly cacheKey = 'attendees:all';

  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly emailQueue: EmailQueue,
  ) {}

  async create(createAttendeeDto: CreateAttendeeDto): Promise<Attendee> {
    const attendee = this.attendeeRepository.create(createAttendeeDto);

    const savedAttendee = await this.attendeeRepository.save(attendee);

    await this.emailQueue.sendConfirmationEmail({
      email: savedAttendee.email,
      name: savedAttendee.name,
    });

    await this.redisService.deleteCache(this.cacheKey);

    return savedAttendee;
  }

  async findAll(): Promise<Attendee[]> {
    const cachedAttendees = await this.redisService.getCache<Attendee[]>(this.cacheKey);
    if (cachedAttendees) {
      return cachedAttendees;
    }

    const attendees = await this.attendeeRepository.find();
    await this.redisService.setCache(this.cacheKey, attendees);

    return attendees;
  }

  async findOne(id: string): Promise<Attendee> {
    const attendee = await this.attendeeRepository.findOne({ where: { id } });
    if (!attendee) {
      throw new HttpException('Attendee not found', HttpStatus.NOT_FOUND);
    }
    return attendee;
  }

async search(query: string): Promise<Attendee[]> {
  if (!query) {
    throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
  }

  return await this.attendeeRepository
    .createQueryBuilder('attendee')
    .where('LOWER(attendee.name) LIKE :query', { query: `%${query.toLowerCase()}%` })
    .orWhere('LOWER(attendee.email) LIKE :query', { query: `%${query.toLowerCase()}%` })
    .getMany();
}


  async remove(id: string): Promise<void> {
    const attendee = await this.findOne(id);
    if (!attendee) {
      throw new HttpException('Attendee not found', HttpStatus.NOT_FOUND);
    }

    await this.attendeeRepository.remove(attendee);
    await this.redisService.deleteCache(this.cacheKey);
  }

  async findAttendeesByEventDate(startDate: Date, endDate: Date) {
    const registrations = await this.entityManager.createQueryBuilder('registration', 'registration')
      .innerJoinAndSelect('registration.event', 'event')
      .innerJoinAndSelect('registration.attendee', 'attendee')
      .where('event.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();
  
    return registrations.map((registration) => ({
      attendee: registration.attendee,
      event: registration.event,
    }));
  }
}
