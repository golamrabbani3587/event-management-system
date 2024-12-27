import { Controller, Post, Get, Param, Patch, Delete, Body, UseInterceptors, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Get('most-registered')
  @ApiOperation({ summary: 'Get event with the most registrations' })
  @ApiResponse({ status: 200, description: 'Event with the most registrations.', type: Event })
  @ApiResponse({ status: 404, description: 'No events found.' })
  async getEventWithMostRegistrations(): Promise<Event> {
    try {
      const event : any = await this.eventsService.getEventWithMostRegistrations();
      return event;
    } catch (error) {
      throw new HttpException('No events found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter events by date' })
  @ApiResponse({ status: 200, description: 'List of filtered events.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'No events found in the given date range.' })
  async filterByDate(
    @Query('startDate') startDate: any,
    @Query('endDate') endDate: any
  ) {
    if (!startDate || !endDate) {
      throw new HttpException('startDate and endDate are required', HttpStatus.BAD_REQUEST);
    }
    return this.eventsService.filterByDate(startDate, endDate);
  }

  @Post()
  @ApiOperation({ summary: 'Create an event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all events' })
  @ApiResponse({ status: 200, description: 'List of events.' })
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single event by ID' })
  @ApiResponse({ status: 200, description: 'The event has been found.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event by ID' })
  @ApiResponse({ status: 200, description: 'The event has been successfully updated.' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiResponse({ status: 204, description: 'The event has been successfully deleted.' })
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
