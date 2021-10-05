import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Returning } from '../../returns/entities/return.entity';
import { Lending } from '../../lendings/entities/lending.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose({ groups: ['findAll'] })
  login: string;

  @Column()
  @Exclude()
  intra: number;

  @Column({ default: '0' })
  @Exclude()
  slack: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Expose({ groups: ['findAll'] })
  penaltiyAt: Date;

  @Column({ default: 0 })
  @Exclude()
  lendingCnt: number;

  @Column({ default: false })
  @Exclude()
  librarian: boolean;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => Returning, (returning) => returning.user)
  returnings: Returning[];

  @OneToMany(() => Returning, (returning) => returning.librarian)
  librarianReturnings: Returning[];

  @OneToMany(() => Lending, (lending) => lending.librarian)
  librarianLendings: Lending[];

  @OneToMany(() => Lending, (lending) => lending.user)
  lendings: Lending[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @Expose({ groups: ['search'] })
  get isPenalty() {
    return new Date() <= this.penaltiyAt;
  }
}
