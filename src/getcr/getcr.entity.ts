/* eslint-disable prettier/prettier */
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn,CreateDateColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity';
import { User } from '../user/user.entity';

@Entity()
export class Getcr {
  @PrimaryGeneratedColumn()
  getid: number;

  
  @ManyToOne(() => User, user => user.getcrs)
  @JoinColumn({ name: 'userId' })
  user: User;

  
  @ManyToOne(() => CR, cr => cr.getCr)
  @JoinColumn({ name: 'crId' }) 
  cr: CR; 

  @CreateDateColumn()
  developerGetAt: Date;
}