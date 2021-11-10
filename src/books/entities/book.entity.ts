import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookInfo } from './bookInfo.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Lending } from '../../lendings/entities/lending.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Book {
  constructor(book: Partial<Book>) {
    Object.assign(this, book);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Expose({ groups: [] })
  @Column()
  donator: string;

  @Expose({
    groups: [
      'books.findOne',
      'books.searchBook',
      'lendings.findOne',
      'lendings.search',
      'reservations.search',
    ],
  })
  @Column()
  callSign: string;

  @Expose({ groups: [] })
  @Column()
  status: number;

  @Expose({ groups: [] })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: [] })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BookInfo, (bookInfo) => bookInfo.books)
  @Expose({
    groups: [
      'users.search',
      'books.searchBook',
      'reservations.search',
      'lendings.findOne',
      'lendings.search',
    ],
  })
  info: BookInfo;

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  @Expose({ groups: [] })
  reservations: Reservation[];

  @OneToMany(() => Lending, (lending) => lending.book)
  @Expose({ groups: ['reservations.search'] })
  lendings: Lending[];

  @Expose({ name: 'dueDate', groups: ['books.findOne'] })
  getDueDate() {
    if (this.lendings && this.lendings.length == 0) return '-';
    const lastLending = this.lendings.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0];
    if (lastLending.returning) {
      return '-';
    } else {
      const tDate = new Date(lastLending['createdAt']);
      tDate.setDate(tDate.getDate() + 14);
      return tDate.toJSON().substring(2, 10).split('-').join('.');
    }
  }

  @Expose({ name: 'status', groups: ['books.findOne'] })
  getStatus() {
    if (this.status == 0) {
      if (this.getDueDate() !== '-') return '대출 중';
      return '비치 중';
    } else if (this.status == 1) return '분실';
    else if (this.status == 2) return '파손';
  }
}
