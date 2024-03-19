import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn,CreateDateColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity';

@Entity()
export class CRPrototype {
  @PrimaryGeneratedColumn()
  prid: number;


  @Column({nullable: true})
  topic: string;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  
  @ManyToOne(() => CR, cr => cr.prototype) // Specify ManyToOne relationship
  @JoinColumn({ name: 'crId' }) // Define the foreign key column
  cr: CR; // Create a property to hold the CR instance
}










