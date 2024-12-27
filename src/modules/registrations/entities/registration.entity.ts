import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Attendee } from '../../attendees/entities/attendee.entity';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.registrations, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Attendee, (attendee) => attendee.registrations, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attendee_id' })
  attendee: Attendee;

  @CreateDateColumn({ type: 'timestamp' })
  registered_at: Date;
}
