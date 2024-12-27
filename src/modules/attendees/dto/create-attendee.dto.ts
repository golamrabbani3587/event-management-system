import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendeeDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the attendee' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the attendee' })
  @IsEmail()
  email: string;
}
