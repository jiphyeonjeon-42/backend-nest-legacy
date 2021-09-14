import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Lending } from '../../lendings/entities/lending.entity';

@Entity()
export class Returning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  condition: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Lending, (lending) => lending.returning)
  lending: Lending;

  @ManyToOne(() => User, (user) => user.returnings)
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianReturnings)
  librarian: User;
}
