import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Returning } from '../../returnings/entities/returning.entity';
import { Book } from '../../books/entities/book.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Lending {
  constructor(lending: Partial<Lending>) {
    Object.assign(this, lending);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  @Expose({ groups: ['lendings.search', 'lendings.findOne'] })
  condition: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Expose({ groups: ['lendings.findOne'] })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  @Expose({ groups: [] })
  updatedAt: Date;

  @Expose({ groups: ['lendings.search', 'lendings.findOne'] })
  @ManyToOne(() => User, (user) => user.lendings, { nullable: false })
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianLendings)
  @Expose({ groups: [] })
  librarian: User;

  @Expose({ groups: ['lendings.search', 'lendings.findOne', 'users.search'] })
  @ManyToOne(() => Book, (book) => book.lendings, { nullable: false })
  book: Book;

  @OneToOne(() => Returning, (returning) => returning.lending)
  @Expose({ groups: ['users.search'] })
  returning: Returning;

  @Expose({
    name: 'dueDate',
    groups: [
      'lendings.search',
      'lendings.findOne',
      'reservations.search',
      'users.search',
    ],
  })
  getdueDate() {
    if (this.returning) throw new Error('lendings.service.find(All) catch');
    const tDate = new Date(this.createdAt);
    tDate.setDate(tDate.getDate() + 14);
    return tDate.toJSON().substring(2, 10).split('-').join('.') + '.';
  }

  @Expose({ name: 'createdAt', groups: ['lendings.findOne'] })
  getCreatedAt() {
    const date = new Date(this.createdAt);
    return date.toJSON().substring(2, 10).split('-').join('.') + '.';
  }
}
