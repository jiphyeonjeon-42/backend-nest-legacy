import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Lending } from '../../lendings/entities/lending.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Returning extends BaseEntity {
  constructor(returning: Partial<Returning>) {
    super();
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
  @Expose({ groups: [] })
  @JoinColumn()
  lending: Lending;

  @ManyToOne(() => User, (user) => user.returnings)
  @Expose({ groups: [] })
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianReturnings)
  @Expose({ groups: [] })
  librarian: User;
}
