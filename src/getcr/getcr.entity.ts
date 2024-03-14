import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
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
}