// id	책의 id
// infoId	책 정보의 id
// donator	기부자 이름
// callSign	청구기호
// status	책 상태(1: 비치중 2: 대출중 3: 분실 4: 파손)
// createdAt	record가 생성된 시각
// 	record가 마지막으로 수정된 시각

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

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  donator: string;

  @Column()
  callSign: string;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BookInfo, (bookInfo) => bookInfo.books)
  info: BookInfo;

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservations: Reservation[];

  @OneToMany(() => Lending, (lending) => lending.book)
  lendings: Lending[];
}
