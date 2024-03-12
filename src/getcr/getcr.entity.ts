import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity';

@Entity()
export class Getcr {
  @PrimaryGeneratedColumn()
  crpId: number;


  @Column()
  description: string;

  @Column()
  comment: string;

  @Column()
  username: string;

  
  @ManyToOne(() => CR, cr => cr.getCr) // Specify ManyToOne relationship
  @JoinColumn({ name: 'crId' }) // Define the foreign key column
  cr: CR; // Create a property to hold the CR instance
}








