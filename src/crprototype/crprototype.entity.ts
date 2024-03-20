// crprototype.entity.ts

import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity';

@Entity()
export class CRPrototype {
  @PrimaryGeneratedColumn()
  prId: number;

  @Column({nullable: true})
  topic: string;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({nullable: true})
  filePath: string;

  @Column({nullable: true})
  crId: number; // Add crId column

  @ManyToOne(() => CR, cr => cr.prototype)
  @JoinColumn({ name: 'crId' })
  cr: CR;
}
