import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, Max, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'The name of the event', example: 'Nodejs Conference' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the event', example: 'Node conference in Dhaka' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The date of the event', example: '2025-01-01' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'The location of the event', example: 'Dhaka' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'The maximum number of attendees', example: 50 })
  @IsNumber()
  @Min(1)
  @Max(1000)
  max_attendees: number;
}
