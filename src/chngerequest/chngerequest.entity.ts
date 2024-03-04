import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

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
  description : string;

  @Column()
  type : string;

  @Column()
  priority: string;


 

}
