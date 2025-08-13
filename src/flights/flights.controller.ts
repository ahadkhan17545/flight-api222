
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { NotFoundException } from '@nestjs/common';
import { FareQuoteService } from './FareQuote.service';
import { CommitBooking } from './CommitBooking.service';

@Controller('flights')
export class FlightsController {
  constructor(
    private readonly flightsService: FlightsService,
     private readonly FareQuoteService:FareQuoteService,
     private readonly CommitBookingService:CommitBooking
    ) {}

  @Post('search')
  async search(@Body() body: any) {
    return this.flightsService.searchFlights(body);
  }

  @Get('by-token/:token')
  async getByToken(@Param('token') token: string) {
   
    return this.flightsService.getByToken(token);
  }

 


  @Post('FareQuote')
  async FareQuote(@Body() body:any){
       return this.FareQuoteService.FetchFareQuoteFromApi(body)
  }

  @Get('by-Search-token/:token')
  async ByToken(@Param('token') token: string) {

      console.log("token controller called ")
    return this.FareQuoteService.GetByToken(token)
  }

  @Post('CommitBooking')
  async CommitBooking(@Body() body:any){
     return this.CommitBookingService.CommitBooking(body)
  }


}