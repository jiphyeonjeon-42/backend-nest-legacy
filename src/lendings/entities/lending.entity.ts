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
  @Expose({ groups: ['lendings.findAll', 'lendings.findOne'] })
  condition: string;

  @CreateDateColumn()
  @Expose({ groups: ['lendings.findOne'] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [] })
  updatedAt: Date;

  @Expose({ groups: ['lendings.findAll', 'lendings.findOne'] })
  @ManyToOne(() => User, (user) => user.lendings)
  user: User;

  @ManyToOne(() => User, (librarian) => librarian.librarianLendings)
  @Expose({ groups: [] })
  librarian: User;

  @Expose({ groups: ['lendings.findAll', 'lendings.findOne'] })
  @ManyToOne(() => Book, (book) => book.lendings)
  book: Book;

  @OneToOne(() => Returning, (returning) => returning.lending)
  @Expose({ groups: [] })
  returning: Returning;

  @Expose({
    name: 'dueDate',
    groups: ['lendings.findAll', 'lendings.findOne', 'reservations.search'],
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
