// src/flights/flights.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { HttpModule } from '@nestjs/axios';
import { FlightsService } from './flights/flights.service';
import { FlightsController } from './flights/flights.controller';
import { FareQuoteService } from './flights/FareQuote.service';
import { CommitBooking } from './flights/CommitBooking.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost', // your redis host
            port: 6379,        // your redis port
          },
          ttl: 3600, 
        }),
      }),
      isGlobal: true,
    }),
      
  ],
  controllers: [FlightsController],
  providers: [FlightsService,FareQuoteService,CommitBooking],
})
export class AppModule {}
