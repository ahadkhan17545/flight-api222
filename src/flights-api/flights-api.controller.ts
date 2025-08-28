import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { FlightsService } from './flight-services';

@Controller('flights-apis')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  
  @Post('search')
  async searchFlights( @Query('source') source: string, @Body() searchParams: any) {
    return this.flightsService.searchFlights(source, searchParams);
  }

  @Post('FareQuote')
  async FareQuote(@Query('source') source:string,@Body() searchParams:any){
    return this.flightsService.Farequote(source,searchParams)
  }

  @Post('CommitBooking')
  async CommitBooking(@Query('source') source:string,@Body() searchParams:any){
    return this.flightsService.CommitBooking(source,searchParams)
  }

  @Post('HoldTicket')
  async HoldTicket(@Query('source') source:string,@Body() searchParams:any){
    return this.flightsService.HoldTicket(source,searchParams)
  }







}
