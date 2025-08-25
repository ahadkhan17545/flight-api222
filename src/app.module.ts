import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { HttpModule } from '@nestjs/axios';
import { FlightsService } from './flights/flights.service';
import { FlightsController } from './flights/flights.controller';
import { FareQuoteService } from './flights/FareQuote.service';
import { CommitBooking } from './flights/CommitBooking.service';
import { Reservation } from './flights/Reservation.service.';
import { FlightsApiController } from './flights-api/flights-api.controller';
import { FlightsApiModule } from './flights-api/flights-api.module';
import { FlightsApiService } from './flights-api/flight-services';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost', 
            port: 6379,        
          },
          ttl: 3600, 
        }),
      }),
      isGlobal: true,
    }),
    FlightsApiModule,
    
      
  ],

  
  controllers: [FlightsController, FlightsApiController],
  providers: [FlightsService,FareQuoteService,CommitBooking,Reservation,FlightsApiService],
})
export class AppModule {}