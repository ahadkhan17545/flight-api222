import { Injectable } from '@nestjs/common';
import { FlightProviderFactory } from './flight-provider.factory';

@Injectable()
@Injectable()
export class FlightsService {
  constructor(private readonly providerFactory: FlightProviderFactory) {}

  async searchFlights(source: string, searchParams: any) {
    const provider = this.providerFactory.getProvider(source); 

    const apiResponse = await provider.FetchFlights(searchParams);

    return apiResponse;
  }

  async Farequote(source: string, searchParams: any) {
    const provider = this.providerFactory.getProvider(source); 

    const apiResponse = await provider.FetchFareQuote(searchParams);

    return apiResponse;
  }

  async CommitBooking(source: string, searchParams: any) {
    const provider = this.providerFactory.getProvider(source); 

    const apiResponse = await provider.CommitBooking(searchParams);

    return apiResponse;
  }

  async HoldTicket(source: string, searchParams: any) {
    const provider = this.providerFactory.getProvider(source); 

    const apiResponse = await provider.HoldTicket(searchParams);

    return apiResponse;
  }


}

