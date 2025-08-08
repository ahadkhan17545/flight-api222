import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { FlightsService } from './flights/flights.service';
import { FlightsModule } from './flights/flights.module';
import { FlightsController } from './flights/flights.controller';


@Module({
  imports: [HttpModule, FlightsModule,],
  controllers: [AppController, FlightsController],
  providers: [AppService, FlightsService],
})
export class AppModule {}
