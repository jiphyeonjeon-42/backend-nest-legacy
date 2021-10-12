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
import { Expose } from 'class-transformer';
@Entity()
export class Reservation {
  constructor(reservation: Partial<Reservation>) {
    Object.assign(this, reservation);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  @Expose({ groups: ['reservations.search'] })
  endAt: Date;

  @CreateDateColumn()
  @Expose({ groups: [] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [] })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  @Expose({ groups: ['reservations.search'] })
  canceledAt: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  @Expose({ groups: ['reservations.search'] })
  user: User;

  @ManyToOne(() => Book, (book) => book.reservations)
  @Expose({ groups: ['reservations.search'] })
  book: Book;
}
