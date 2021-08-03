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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  intra: string;

  @Column()
  slack: string;

  @Column()
  lendingCnt: number;

  @Column()
  reservationCnt: number;

  @Column()
  librarian: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
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
}
