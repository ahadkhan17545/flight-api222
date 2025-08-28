// src/flights-api/flights-api.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { FlightsController } from './flights-api.controller';
import { FlightsService } from './flight-services';

// Providers
import { FlightProviderFactory } from './flight-provider.factory';
import { TMXProvider } from './Third-party-apis/TMX-Api/tmx-provider';
// import { TBOProvider } from './Third-Party-apis/TBO-Api/tbo.provider';
// import { BirdProvider } from './Third-Party-apis/Bird-Api/bird.provider';

@Module({
  imports: [HttpModule], // for external API calls
  controllers: [FlightsController],
  providers: [
    FlightsService,      // <-- register service here
    FlightProviderFactory,
    TMXProvider,
    // TBOProvider,
    // BirdProvider,
  ],
  exports: [FlightsService, FlightProviderFactory], // so AppModule/other modules can use
})
export class FlightsModule {}
