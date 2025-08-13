// src/flights/flights.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { FareQuoteService } from './FareQuote.service';
import { CommitBooking } from './CommitBooking.service';

@Module({
  imports: [HttpModule],
  providers: [FlightsService],
  controllers: [FlightsController],
  exports:[FareQuoteService,CommitBooking]
})
export class FlightsModule {}
