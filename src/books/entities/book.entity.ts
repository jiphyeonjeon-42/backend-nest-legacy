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
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  donator: string;

  @Column()
  callSign: string;

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

  @Expose({ name: 'dueDate' })
  getDueDate() {
    if (this.id % 2) {
      const tDate = new Date();
      return tDate.toJSON().substring(2, 10).split('-').join('.');
    }
    else {
      return null;
    }
  }
}
