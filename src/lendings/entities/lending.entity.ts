import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  RelationId,
  ManyToOne,
  OneToOne,
  BaseEntity,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Returning } from '../../returnings/entities/returning.entity';
import { Book } from '../../books/entities/book.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Lending extends BaseEntity {
  constructor(lending: Partial<Lending>) {
    super();
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

  @Column({ type: 'uuid' })
  @RelationId((lending: Lending) => lending.user)
  userId: number;

  @ManyToOne(() => User, (librarian) => librarian.librarianLendings)
  @Expose({ groups: [] })
  librarian: User;

  @Column({ type: 'uuid' })
  @RelationId((lending: Lending) => lending.user)
  librarianId: number;

  @Expose({ groups: ['lendings.search', 'lendings.findOne', 'users.search'] })
  @ManyToOne(() => Book, (book) => book.lendings, { nullable: false })
  book: Book;

  @Column({ type: 'uuid' })
  @RelationId((lending: Lending) => lending.user)
  bookId: number;

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
