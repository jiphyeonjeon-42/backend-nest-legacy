import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Returning } from '../../returns/entities/return.entity';
import { Book } from '../../books/entities/book.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Lending {
  constructor(lending: Partial<Lending>) {
    Object.assign(this, lending);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  @Expose({ groups: ['findAll'] })
  condition: string;

  @CreateDateColumn()
  @Expose({ groups: ['findAll'] })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Expose({ groups: ['findAll'] })
  @ManyToOne(() => User, (user) => user.lendings)
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianLendings)
  @Exclude()
  librarian: User;

  @Expose({ groups: ['findAll'] })
  @ManyToOne(() => Book, (book) => book.lendings)
  book: Book;

  @OneToOne(() => Returning, (returning) => returning.lending)
  @Exclude()
  @JoinColumn()
  returning: Returning;

  @Expose({ name: 'dueDate', groups: ['findAll'] })
  getDate() {
    const date = new Date(this.createdAt);
    return (
      date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate() + '.'
    );
  }
}
