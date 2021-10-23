import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Returning } from '../../returnings/entities/returning.entity';
import { Lending } from '../../lendings/entities/lending.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Expose } from 'class-transformer';

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose({
    groups: ['lendings.search', 'lendings.findOne', 'reservations.search'],
  })
  login: string;

  @Column()
  @Expose({ groups: [] })
  intra: number;

  @Column({ default: '0' })
  @Expose({ groups: [] })
  slack: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Expose({ groups: [] })
  penaltyAt: Date;

  @Column({ default: false })
  @Expose({ groups: [] })
  librarian: boolean;

  @CreateDateColumn()
  @Expose({ groups: [] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [] })
  updatedAt: Date;

  @OneToMany(() => Returning, (returning) => returning.user)
  @Expose({ groups: [] })
  returnings: Returning[];

  @OneToMany(() => Returning, (returning) => returning.librarian)
  @Expose({ groups: [] })
  librarianReturnings: Returning[];

  @OneToMany(() => Lending, (lending) => lending.librarian)
  @Expose({ groups: [] })
  librarianLendings: Lending[];

  @OneToMany(() => Lending, (lending) => lending.user)
  @Expose({ groups: [] })
  lendings: Lending[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  @Expose({ groups: [] })
  reservations: Reservation[];

  @Expose({ groups: ['users.search'] })
  get isPenalty() {
    return new Date() <= this.penaltyAt;
  }

  @Expose({ groups: ['lendings.search', 'lendings.findOne'] })
  get penaltyDays() {
    const penalty = new Date(this.penaltyAt);
    const today = new Date();
    if (penalty < today) return '-';
    return Math.ceil(Math.abs(+penalty - +today) / (1000 * 3600 * 24));
  }
}
