import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

import { Book } from './book.entity';
import { Expose } from 'class-transformer';

export enum BookCategory {
  PROGRAMING_LANGUAGE = '프로그래밍 언어',
  WEB_PROGRAMMING = '웹 프로그래밍',
  NETWORK = '네트워크',
  GAME_MOBILE = '모바일 프로그래밍',
  CLOUD = '클라우드',
  DATABASE = '데이터베이스',
  OS_SYSTEM = '운영체제/컴퓨터시스템',
  SOFTWARE_ENGINEERING = '개발방법론',
  ALGORITHM = '자료구조/알고리즘',
  GAME = '게임',
  DATA_AI_ML = '데이터 분석/AI/ML',
  SECURITY = '보안/해킹/블록체인',
  COMPUTER = '컴퓨터 개론',
  DESIGN = '디자인/그래픽',
  IT = 'IT 일반',
  CERTIFICATE = '자격증',
  GENERAL_WORK = '총류',
  SOCIAL_SCIENCE = '사회과학',
  ART = '예술',
  TECHNOLOGICAL_SCIENCE = '기술과학',
  LANGUAGE = '어학',
  PURE_SCIENCE = '순수과학',
  PHILOSOPHY = '철학',
  NATURAL_SCIENCE = '자연과학',
  HISTORY = '역사',
  LITERATURE = '문학',
  RELIGION = '종교',
  NOT_DEVELOP = '비개발',
  NONE = '미정',
}

@Entity()
export class BookInfo extends BaseEntity {
  constructor(bookInfo: Partial<BookInfo>) {
    super();
    Object.assign(this, bookInfo);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose({
    groups: [
      'books.findOne',
      'books.findInfo',
      'books.searchBook',
      'lendings.search',
      'lendings.findOne',
      'reservations.search',
      'users.search',
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
  @Expose({
    groups: [
      'books.findOne',
      'books.findInfo',
      'books.searchBook',
      'lendings.findOne',
      'reservations.search',
    ],
  })
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
  @OneToMany(() => Book, (book) => book.info, { cascade: true })
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
    if (!this.publishedAt) {
      return null;
    }
    const date = new Date(this.publishedAt);
    return date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월';
  }
}
