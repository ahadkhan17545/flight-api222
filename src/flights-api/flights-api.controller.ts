import { Controller, Param } from '@nestjs/common';
import { Post,Body,Get } from '@nestjs/common';
import { FlightSearchDto } from './Dtos/flight-Search.dto' 
import { FlightsApiService } from './flight-services';
import {BookingDto } from './Dtos/Booking.dto';


@Controller('flights-api')
export class FlightsApiController {

  constructor(
    private readonly flightApi:FlightsApiService
  ){}


    @Post('search')
  async search(@Body() body:FlightSearchDto) {
    return this.flightApi.searchFlights(body)
  }


  @Post('FareQuote')
  async FareQuote(@Body() body:any){
    return this.flightApi.FetchFareQuote(body)
  }

@Post('CommitBooking')
async CommitBooking(@Body() body:BookingDto){
  return this.flightApi.CommitBooking(body)
}


@Post('AppReference')
async AppReference(){
  return this.flightApi.GenerateAppRefernce();
}

@Get('GetByToken/:token')
async GetByToken(@Param('token') token:string){
  return this.flightApi.getByToken(token);
}

@Post('HoldTicket')
async HoldTicket(@Body() body:BookingDto){
  return this.flightApi.HoldTicket(body);
}

}
