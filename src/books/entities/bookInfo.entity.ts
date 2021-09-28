import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Book } from './book.entity';
import { Exclude, Expose } from 'class-transformer';

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
  @Expose({ groups: ['findAll'] })
  title: string;

  @Column()
  @Exclude()
  author: string;

  @Column()
  @Exclude()
  publisher: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  isbn: string;

  @Column()
  @Exclude()
  image: string;

  @Column({
    type: 'enum',
    enum: BookCategory,
    default: BookCategory.WEB_PROGRAMMING,
  })
  @Exclude()
  category: BookCategory;

  @Column({
    type: 'date',
    nullable: true,
  })
  @Exclude()
  publishedAt: Date;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Book, (book) => book.info)
  books: Book[];

  @Expose({ name: 'donators', groups: ['detail'] })
  getDonators() {
    const donators = new Set();
    for (const book of this.books) {
      if (book.donator != '') donators.add(book.donator);
    }
    if (donators.size == 0) return '-';
    return [...donators].join(', ');
  }

  @Expose({ name: 'publishedAt', groups: ['detail'] })
  getDate() {
    const date = new Date(this.publishedAt);
    console.log(date);
    return date.getFullYear() + '년 ' + date.getMonth() + '월';
  }
}
