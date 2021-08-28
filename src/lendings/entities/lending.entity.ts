import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Returning } from '../../returns/entities/return.entity';
import { Book } from '../../books/entities/book.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Lending {
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

  @OneToMany(() => Returning, (returning) => returning.lending)
  returnings: Returning[];
}
