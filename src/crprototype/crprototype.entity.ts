/* eslint-disable prettier/prettier */


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

  @Column({nullable: true})
  estimatedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({nullable: true})
  filePath: string;

  @Column({nullable: true})
  popupstatus: string;

  @Column({nullable: true})
  rejectionReason: string;

  @Column({nullable: true})
  crId: number; 

  @ManyToOne(() => CR, cr => cr.prototype)
  @JoinColumn({ name: 'crId' })
  cr: CR;
}
