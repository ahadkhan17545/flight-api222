import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightsApiService } from './flight-services';
import { FlightsApiController } from './flights-api.controller';

@Module({

    imports: [HttpModule],
    providers:[FlightsApiService],
    controllers:[FlightsApiController]


})
export class FlightsApiModule {}
