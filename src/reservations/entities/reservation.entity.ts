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
  @Expose({ groups: ['reservations.search', 'users.search'] })
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
  @Expose({ groups: ['reservations.search', 'users.search'] })
  book: Book;

  @Expose({ name: 'lenderableDate', groups: ['users.search'] })
  getLenderableDate() {
    return this.book.getDueDate();
  }

  @Expose({ name: 'endAt', groups: ['users.search'] })
  getEndAt() {
    if (!this.endAt) {
      return '-';
    }
    return this.endAt.toJSON().substring(2, 10).split('-').join('.') + '.';
  }

  @Expose({ name: 'rank', groups: ['users.search'] })
  getRank() {
    if (!this.endAt) {
      return null;
    }
    return 1;
  }
}
