import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  endAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  canceledAt: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Book, (book) => book.reservations)
  book: Book;
}
