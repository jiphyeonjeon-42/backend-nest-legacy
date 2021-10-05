import { EntitySchema } from 'typeorm';
import { User } from './user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    login: {
      type: String,
    },
    intra: {
      type: Number,
    },
    slack: {
      type: String,
    },
    penaltyAt: {
      type: Date,
    },
    reservationCnt: {
      type: Number,
    },
    librarian: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  relations: {
    returnings: {
      type: 'one-to-many',
      target: 'Returning',
    },
    librarianReturnings: {
      type: 'one-to-many',
      target: 'Returning',
    },
    librarianLendings: {
      type: 'one-to-many',
      target: 'Lending',
    },
    lendings: {
      type: 'one-to-many',
      target: 'Lending',
    },
    reservations: {
      type: 'one-to-many',
      target: 'Reservation',
    },
  },
});
