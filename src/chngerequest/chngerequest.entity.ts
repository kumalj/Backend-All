import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
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

  @Column()
    priorityOrder: number;

    @ManyToOne(() => User, user => user.changeRequests)
    @JoinColumn({ name: 'userId' }) 
    userId: User; 
  


 

}
