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
    // TODO : 실제로는 returning 테이블과도 연결해야 함
    /*
    for(let lending of this.lendings){
      if (lending.createdAt){
        let tDate = new Date(lending.createdAt);
        tDate.setDate(tDate.getDate()+14);
        let result = tDate.toJSON().substring(2, 10).split('-').join('.');
        return (result);
      }
      else{
        throw new Error("no createdAt");
      }
    }
    */
    // 테스트를 위한 하드코딩
    if (this.id % 2) {
      const tDate = new Date();
      return tDate.toJSON().substring(2, 10).split('-').join('.');
    }
    // 대출 중인 책이 아닐 때
    else {
      return null;
    }
  }
}
