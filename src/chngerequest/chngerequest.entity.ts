/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne,OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Getcr } from '../getcr/getcr.entity';
import { CRPrototype } from '../cr-prototype/cr-prototype.entity';

@Entity()
export class CR {
  @PrimaryGeneratedColumn()
  crId: number;


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
  status: string;

  // @Column({ type: 'longblob', nullable: true }) // Change the data type to LONGBLOB
  // file: Buffer; // Use Buffer type for binary data

  @ManyToOne(() => User, user => user.changeRequests)
  @JoinColumn({ name: 'userId' })
  userId: User;

  
  @OneToMany(() => Getcr, getCr => getCr.cr) // Specify ManyToOne relationship
  @JoinColumn({ name: 'crId' })
  getCr: Getcr; 


  @OneToMany(() => CRPrototype, crPrototype => crPrototype.cr) // Specify ManyToOne relationship
  @JoinColumn({ name: 'crId' })
  prototype: CRPrototype; 









}
