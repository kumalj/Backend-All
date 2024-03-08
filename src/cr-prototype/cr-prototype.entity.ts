import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity';

@Entity()
export class CRPrototype {
  @PrimaryGeneratedColumn()
  crpId: number;

  @Column()
  uniqueKey: string;

  @Column()
  description: string;

  @Column()
  comment: string;

  
  @ManyToOne(() => CR, cr => cr.prototype) // Specify ManyToOne relationship
  @JoinColumn({ name: 'crId' }) // Define the foreign key column
  cr: CR; // Create a property to hold the CR instance
}






