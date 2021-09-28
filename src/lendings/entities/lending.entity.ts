import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Returning } from '../../returns/entities/return.entity';
import { Book } from '../../books/entities/book.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Lending {
  constructor(lending: Partial<Lending>) {
    Object.assign(this, lending);
  }

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ default: '' })
  @Exclude()
  condition: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.lendings)
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianLendings)
  librarian: User;

  @ManyToOne(() => Book, (book) => book.lendings)
  book: Book;

  @OneToOne(() => Returning, (returning) => returning.lending)
  returning: Returning;
}
