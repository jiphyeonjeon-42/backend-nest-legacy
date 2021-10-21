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
      'lendings.findAll',
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
    if (this.lendings.length == 0) return '-';
    for (const lending of this.lendings) {
      if (lending.returning) {
        return '-';
      } else {
        const tDate = new Date(lending['createdAt']);
        tDate.setDate(tDate.getDate() + 14);
        return tDate.toJSON().substring(2, 10).split('-').join('.');
      }
    }
  }

  @Expose({ name: 'status', groups: ['books.findOne'] })
  getStatus() {
    if (this.status == 1) return '비치중';
    else if (this.status == 2) return '대출중';
    else if (this.status == 3) return '분실';
    else if (this.status == 4) return '파손';
  }
}
