import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @ApiProperty({ example: 'event-uuid', description: 'The ID of the event' })
  @IsUUID()
  event_id: string;

  @ApiProperty({ example: 'attendee-uuid', description: 'The ID of the attendee' })
  @IsUUID()
  attendee_id: string;
}
