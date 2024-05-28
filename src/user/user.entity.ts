/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { CR } from '../chngerequest/chngerequest.entity'
import { Getcr } from 'src/getcr/getcr.entity';

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
  extension: number;

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
  

  @OneToMany(() => Getcr, getcr => getcr.user)
  @JoinColumn({ name: 'userId' }) 
  getcrs: Getcr[];

  

}
