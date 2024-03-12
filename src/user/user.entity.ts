/* eslint-disable prettier/prettier */
// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity'
import { Getcr } from 'src/getcr/getcr.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column() 
  uniqueKey: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  userType: string;

  @Column()
  status: string;

  @OneToMany(() => CR, cr => cr.userId)
  @JoinColumn({ name: 'userId' }) 
  changeRequests: CR[]; 

  @OneToMany(() => Getcr, getcr => getcr.user)
  @JoinColumn({ name: 'userId' }) 
  getcrs: Getcr[];

  

}
