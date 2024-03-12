/* eslint-disable prettier/prettier */
// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  department: string;

  @Column()
  password: string;

  @Column()
  userType: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CR, cr => cr.userId)
  @JoinColumn({ name: 'userId' }) 
  changeRequests: CR[]; 


  

  

}
