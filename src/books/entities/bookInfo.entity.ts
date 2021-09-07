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

@Entity()
export class BookInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  isbn: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @Column({ type: 'date' })
  publishedAt: Date;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Book, (book) => book.info)
  books: Book[];

  @Expose({
    groups: ['detail'],
  })
  donators() {
    const donators = new Set();
    for (const book of this.books) {
      if (book.donator != '') donators.add(book.donator);
    }
    if (donators.size == 0) return '-';
    return [...donators].join(', ');
  }
}
