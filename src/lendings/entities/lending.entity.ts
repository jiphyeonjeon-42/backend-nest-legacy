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
  @Expose({ groups: ['findAll', 'find'] })
  condition: string;

  @CreateDateColumn()
  @Expose({ groups: ['find'] })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Expose({ groups: ['findAll', 'find'] })
  @ManyToOne(() => User, (user) => user.lendings)
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianLendings)
  @Exclude()
  librarian: User;

  @Expose({ groups: ['findAll', 'find'] })
  @ManyToOne(() => Book, (book) => book.lendings)
  book: Book;

  @OneToOne(() => Returning, (returning) => returning.lending)
  @Exclude()
  returning: Returning;

  @Expose({ name: 'dueDate', groups: ['findAll', 'find'] })
  getdueDate() {
    if (this.returning) throw new Error('lendings.service.find(All) catch');
    const tDate = new Date(this.createdAt);
    tDate.setDate(tDate.getDate() + 14);
    return tDate.toJSON().substring(2, 10).split('-').join('.') + '.';
  }

  @Expose({ name: 'createdAt', groups: ['find'] })
  getCreatedAt() {
    const date = new Date(this.createdAt);
    return date.toJSON().substring(2, 10).split('-').join('.') + '.';
  }
}
