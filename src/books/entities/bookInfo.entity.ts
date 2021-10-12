import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Book } from './book.entity';
import { Expose } from 'class-transformer';

export enum BookCategory {
  LANGUAGE = '프로그래밍 언어',
  NETWORK = '네트워크',
  WEB_PROGRAMMING = '웹 프로그래밍',
  GAME_MOBILE = '게임개발/모바일',
  OS_SYSTEM = '운영체제/컴퓨터시스템',
  SOFTWARE_ENGINEERING = '소프트웨어 공학',
  ALGORITHM = '자료구조/알고리즘',
  TECH_CULTURE = '기술 교양',
}

@Entity()
export class BookInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose({
    groups: [
      'books.findOne',
      'books.findInfo',
      'books.searchBook',
      'lendings.findAll',
      'lendings.findOne',
      'reservations.search',
    ],
  })
  title: string;

  @Column()
  @Expose({ groups: ['books.findOne', 'books.findInfo', 'books.searchBook'] })
  author: string;

  @Column()
  @Expose({ groups: ['books.findOne', 'books.findInfo', 'books.searchBook'] })
  publisher: string;

  @Column({
    nullable: true,
  })
  @Expose({ groups: ['books.findOne', 'books.findInfo'] })
  isbn: string;

  @Column()
  @Expose({ groups: ['books.findOne', 'books.findInfo', 'lendings.findOne'] })
  image: string;

  @Column({
    type: 'enum',
    enum: BookCategory,
    default: BookCategory.WEB_PROGRAMMING,
  })
  @Expose({ groups: ['books.findOne', 'books.findInfo', 'books.searchBook'] })
  category: BookCategory;

  @Column({
    type: 'date',
    nullable: true,
  })
  @Expose({ groups: [] })
  publishedAt: Date;

  @Expose({ groups: [] })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: [] })
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose({ groups: ['books.findOne'] })
  @OneToMany(() => Book, (book) => book.info)
  books: Book[];

  @Expose({ name: 'donators', groups: ['books.findOne'] })
  getDonators() {
    const donators = new Set();
    for (const book of this.books) {
      if (book.donator != '') donators.add(book.donator);
    }
    if (donators.size == 0) return '-';
    return [...donators].join(', ');
  }

  @Expose({ name: 'publishedAt', groups: ['books.findOne', 'books.findInfo'] })
  getDate() {
    const date = new Date(this.publishedAt);
    return date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월';
  }
}
