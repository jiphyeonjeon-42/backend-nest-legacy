import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservations.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/user.repository';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      ReservationRepository,
      UserRepository,
      User,
      Reservation,
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
