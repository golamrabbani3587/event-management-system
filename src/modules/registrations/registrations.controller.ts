import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Registration } from './entities/registration.entity';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationService) {}

@Get('multiple-events')
@ApiOperation({ summary: 'List attendees registered for multiple events' })
@ApiResponse({ status: 200, description: 'List of attendees who registered for multiple events.' })
async getAttendeesForMultipleEvents(): Promise<any[]> {
  return this.registrationsService.getAttendeesForMultipleEvents();
}

  @Post()
  @ApiOperation({ summary: 'Register an attendee for an event' })
  @ApiResponse({ status: 201, description: 'Registration created successfully.', type: Registration })
  async create(@Body() createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    return this.registrationsService.create(createRegistrationDto);
  }

  @Get(':event_id')
  @ApiOperation({ summary: 'List all registrations for an event' })
  @ApiResponse({ status: 200, description: 'Registrations retrieved successfully.', type: [Registration] })
  async findByEvent(@Param('event_id') eventId: string): Promise<Registration[]> {
    return this.registrationsService.findByEvent(eventId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a registration' })
  @ApiResponse({ status: 204, description: 'Registration deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Registration not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.registrationsService.remove(id);
  }
}
