import { EntityRepository, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {}
