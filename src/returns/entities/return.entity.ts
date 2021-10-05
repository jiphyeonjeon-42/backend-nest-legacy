import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { User } from '../../users/entities/user.entity';
import { Lending } from '../../lendings/entities/lending.entity';

@Entity()
export class Returning {
  constructor(returning: Partial<Returning>) {
    Object.assign(this, returning);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose({ groups: [] })
  condition: string;

  @CreateDateColumn()
  @Expose({ groups: [] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [] })
  updatedAt: Date;

  @OneToOne(() => Lending, (lending) => lending.returning)
  @JoinColumn()
  @Expose({ groups: [] })
  lending: Lending;

  @ManyToOne(() => User, (user) => user.returnings)
  @Expose({ groups: [] })
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianReturnings)
  @Expose({ groups: [] })
  librarian: User;
}
