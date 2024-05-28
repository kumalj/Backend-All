/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne,OneToMany, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Getcr } from '../getcr/getcr.entity';
import { CRPrototype } from '../crprototype/crprototype.entity';

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
  crtype: string;

  @Column({ length: 10000, nullable: true }) 
  description: string;
  
  @Column({ type: 'int' })
  priority: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @Column({nullable: true})
  filePath: string;


  @Column({nullable: true})
  status: string;

  @Column({nullable: true})
  developer: string;

  @Column({nullable: true})
  requiredDate: Date;
  
  @Column({})
  @Column({nullable: true})
  hodApprovel: string;

  @Column({nullable: true})
  hodApprovelAt: Date;

  @Column({nullable: true})
  getToDevelopmentAt: Date;

  @Column({nullable: true})
  ProtoCreatedAt: Date;

  @Column({nullable: true})
  secondProtoCreatedAt: Date;

  @Column({nullable: true})
  prototypeApproveAt: Date;

  @Column({nullable: true})
  needUatApprovelAt: Date;

  @Column({nullable: true})
  UatApprovedBy: String;

  @Column({nullable: true})
  devCompletedAt: Date;


  @ManyToOne(() => User, user => user.changeRequests)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @OneToMany(() => Getcr, getCr => getCr.cr) 
  @JoinColumn({ name: 'crId' })
  getCr: Getcr; 

  @OneToMany(() => CRPrototype, crPrototype => crPrototype.cr)
  @JoinColumn({ name: 'crId' })
  prototype: CRPrototype; 

  
}