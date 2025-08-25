
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { FareQuoteService } from './FareQuote.service';
import { CommitBooking } from './CommitBooking.service';
import { Reservation } from './Reservation.service.';
import { FlightSearchDto } from '../flights-api/Dtos/flight-Search.dto';

@Module({
  imports: [HttpModule],
  providers: [FlightsService],
  controllers: [FlightsController],
  exports:[FareQuoteService,CommitBooking,Reservation,FlightSearchDto]
})
export class FlightsModule {}
