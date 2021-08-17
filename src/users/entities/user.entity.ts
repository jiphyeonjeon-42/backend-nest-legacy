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
  constructor(login: string, intra: number) {
    this.login = login;
    this.intra = intra;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  intra: number;

  @Column({ default: '0' })
  slack: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  penaltiyAt: Date;

  @Column({ default: 0 })
  lendingCnt: number;

  @Column({ default: 0 })
  reservationCnt: number;

  @Column({ default: false })
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
