// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  password: string;

  @Column()
  userType: string;

  @Column()
  status: string;

  // @OneToMany(type => CR, changeRequest => changeRequest.user)
  // changeRequests: CR[];


}
