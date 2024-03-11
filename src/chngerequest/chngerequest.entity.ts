/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne,OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';


@Entity()
export class CR {
  @PrimaryGeneratedColumn()
  crId: number;

  @Column()
  uniqueKey: string;

  @Column()
  name: string;

  @Column()
  department: string;

  @Column()
  topic: string;

  @Column()
  description: string;

  @Column()
  priority: string;

  @Column()
  priorityOrder: number;

  @Column()
  status: string;

  // @Column({ type: 'longblob', nullable: true }) // Change the data type to LONGBLOB
  // file: Buffer; // Use Buffer type for binary data

  @ManyToOne(() => User, user => user.changeRequests)
  @JoinColumn({ name: 'userId' })
  userId: User;









}
