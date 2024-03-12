import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity';
import { User } from '../user/user.entity';

@Entity()
export class Getcr {
  @PrimaryGeneratedColumn()
  getId: number;

  
  @ManyToOne(() => User, user => user.changeRequests)
  @JoinColumn({ name: 'userId' })
  userId: User;

  
  
  @ManyToOne(() => CR, cr => cr.getCr) // Specify ManyToOne relationship
  @JoinColumn({ name: 'crId' }) // Define the foreign key column
  cr: CR; // Create a property to hold the CR instance
}








