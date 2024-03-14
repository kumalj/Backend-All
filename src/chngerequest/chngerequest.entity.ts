/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne,OneToMany, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Getcr } from '../getcr/getcr.entity';
import { CRPrototype } from '../cr-prototype/cr-prototype.entity';

@Entity()
export class CR {
  @PrimaryGeneratedColumn()
  crId: number;


  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  department: string;

  @Column({nullable: true})
  topic: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: true})
  priority: string;

  @CreateDateColumn()
  createdAt: Date;


  @Column({nullable: true})
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
