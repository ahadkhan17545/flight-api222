import { Controller, Post, Body } from '@nestjs/common';
import { FlightsService } from './flights.service';


@Controller('flight')
export class FlightsController {
  constructor(private readonly flightService: FlightsService) {}

  @Post('search')
async Search(@Body() body: any) {
  return this.flightService.searchFlights(body);
}

@Post('fare-Rules')
async fetchFareRules(@Body() body: any) {
  return this.flightService.fetchFareRules(body);
}

@Post('fare-Quote')
async fetchFareQuote(@Body() body:any){
    return this.flightService.FetchFareQuote(body)
}

@Post('UpdatedFare-Quote')
async UpdatedFareQuote(@Body() body:any){
    return this.flightService.UpdatedFareQuoteRound(body)
}

@Post('ExtraServices')
async ExtraServices(@Body() body:any){
    return this.flightService.ExtraService(body)
}

@Post('CommitBooking')
async CommitBooking(@Body() body:any){
    return this.flightService.CommitBooking(body)
}





}





