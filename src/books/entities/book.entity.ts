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
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Book {
  constructor(book: Partial<Book>) {
    Object.assign(this, book);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  donator: string;

  @Column()
  callSign: string;

  @Exclude()
  @Column()
  status: number;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BookInfo, (bookInfo) => bookInfo.books)
  info: BookInfo;

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservations: Reservation[];

  @OneToMany(() => Lending, (lending) => lending.book)
  @Exclude()
  lendings: Lending[];

  @Expose({ name: 'dueDate', groups: ['detail'] })
  getDueDate() {
    if (this.lendings.length == 0) return '-';
    for (const lending of this.lendings) {
      if (lending.returning) {
        return '-';
      } else {
        const tDate = new Date(lending['createdAt']);
        tDate.setDate(tDate.getDate() + 15);
        return tDate.toJSON().substring(2, 10).split('-').join('.');
      }
    }
  }

  @Expose({ name: 'status', groups: ['detail'] })
  getStatus() {
    if (this.status == 1) return '비치중';
    else if (this.status == 2) return '대출중';
    else if (this.status == 3) return '분실';
    else if (this.status == 4) return '파손';
  }
}
