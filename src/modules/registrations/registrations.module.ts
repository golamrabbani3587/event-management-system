import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationsController } from './registrations.controller';
import { RegistrationService } from './registrations.service';
import { Registration } from './entities/registration.entity';
import { RedisService } from '../cache/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Registration])],
  controllers: [RegistrationsController],
  providers: [RegistrationService, RedisService],
})
export class RegistrationsModule {}
