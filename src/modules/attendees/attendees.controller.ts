import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { Attendee } from './entities/attendee.entity';

@ApiTags('Attendees')
@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search attendees by name or email' })
  @ApiResponse({ status: 200, description: 'Attendees matching the search criteria.', type: [Attendee] })
  async search(@Query('query') query: string): Promise<Attendee[]> {
    return this.attendeesService.search(query);
  }
  
  @Post()
  @ApiOperation({ summary: 'Add a new attendee' })
  @ApiResponse({ status: 201, description: 'Attendee created successfully.', type: Attendee })
  async create(@Body() createAttendeeDto: CreateAttendeeDto): Promise<Attendee> {
    return this.attendeesService.create(createAttendeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all attendees' })
  @ApiResponse({ status: 200, description: 'Attendees retrieved successfully.', type: [Attendee] })
  async findAll(): Promise<Attendee[]> {
    return this.attendeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve attendee details' })
  @ApiResponse({ status: 200, description: 'Attendee details retrieved successfully.', type: Attendee })
  @ApiResponse({ status: 404, description: 'Attendee not found.' })
  async findOne(@Param('id') id: string): Promise<Attendee> {
    return this.attendeesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attendee' })
  @ApiResponse({ status: 204, description: 'Attendee deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Attendee not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.attendeesService.remove(id);
  }
}
