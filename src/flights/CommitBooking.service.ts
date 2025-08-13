import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from 'cache-manager'
import { HttpService } from "@nestjs/axios";
import { first, firstValueFrom } from "rxjs";



@Injectable()
export class CommitBooking {

    constructor(
        private readonly http: HttpService,
        @Inject(CACHE_MANAGER) private readonly Cache_Manager: Cache
    ) { }

    formatCommitBooking(raw: any) {
        return {
            Status: raw?.Status ?? null,
            Message: raw?.Message ?? null,
            CommitBooking: {
                BookingDetails: {
                    BookingId: raw?.CommitBooking?.BookingDetails?.BookingId ?? null,
                    PNR: raw?.CommitBooking?.BookingDetails?.PNR ?? null,
                    TicketingTimeLimit: raw?.CommitBooking?.BookingDetails?.TicketingTimeLimit ?? null,
                    PassengerDetails: (raw?.CommitBooking?.BookingDetails?.PassengerDetails || []).map((Details) => ({
                        PassengerId: Details?.PassengerId ?? null,
                        PassengerType: Details?.PassengerType ?? null,
                        Title: Details?.Title ?? null,
                        FirstName: Details?.FirstName ?? null,
                        LastName: Details?.LastName ?? null,
                        TicketNumber: Details?.TicketNumber ?? null
                    })),
                    JourneyList: {
                        FlightDetails: {
                            Details: (raw?.CommitBooking?.BookingDetails?.JourneyList?.FlightDetails?.Details ?? []).map((SegmentArray) =>
                                SegmentArray.map((Segment) => ({


                                    Origin: {
                                        AirportCode: Segment?.Origin?.AirportCode ?? null,
                                        CityName: Segment?.Origin?.CityName ?? null,
                                        AirportName: Segment?.Origin?.AirportName ?? null,
                                        DateTime: Segment?.Origin?.DateTime ?? null,
                                        FDTV: Segment?.Origin?.FDTV ?? null,
                                        Terminal: Segment?.Origin?.Terminal ?? null
                                    },

                                    Destination: {

                                        AirportCode: Segment?.Destination?.AirportCode ?? null,
                                        CityName: Segment?.Destination?.CityName ?? null,
                                        AirportName: Segment?.Destination?.AirportName ?? null,
                                        DateTime: Segment?.Destination?.DateTime ?? null,
                                        FDTV: Segment?.Destination?.FDTV ?? null,
                                        Terminal: Segment?.Destination?.Terminal ?? null

                                    },
                                    AirlinePNR: Segment?.AirlinePNR ?? null,
                                    OperatorCode: Segment?.OperatorCode ?? null,
                                    DisplayOperatorCode: Segment?.DisplayOperatorCode ?? null,
                                    OperatorName: Segment?.OperatorName ?? null,
                                    FlightNumber: Segment?.FlightNumber ?? null,
                                    CabinClass: Segment?.CabinClass ?? null,
                                    Attr: {
                                        Baggage: Segment?.Attr?.Baggage ?? null,
                                        CabinBaggage: Segment?.Attr?.CabinBaggage ?? null,
                                        AvailableSeats: Segment?.Attr?.AvailableSeats ?? null
                                    }
                                }))
                            )
                        }
                    },
                    Price: {
                        Currency: raw?.CommitBooking?.BookingDetails?.Price?.Currency?? null,
                        TotalDisplayFare: raw?.CommitBooking?.BookingDetails?.Price?.TotalDisplayFare ?? null,
                        PriceBreakup: {
                            BasicFare: raw?.CommitBooking?.BookingDetails?.Price?.PriceBreakup?.BasicFare ?? null,
                            Tax: raw?.CommitBooking?.BookingDetails?.Price?.PriceBreakup?.Tax ?? null,
                            AgentCommission: raw?.CommitBooking?.BookingDetails?.Price?.PriceBreakup?.AgentCommission ?? null,
                            AgentTdsOnCommision: raw?.CommitBooking?.BookingDetails?.Price?.PriceBreakup?.AgentTdsOnCommision ?? null
                        },
                        PassengerBreakup: {
                            ADT: {
                                BasePrice: raw?.CommitBooking?.BookingDetails?.Price?.PassengerBreakup?.ADT?.BasePrice ?? null,
                                Tax: raw?.CommitBooking?.BookingDetails?.Price?.PassengerBreakup?.ADT?.Tax ?? null,
                                TotalPrice: raw?.CommitBooking?.BookingDetails?.Price?.PassengerBreakup?.ADT?.TotalPrice ?? null,
                                PassengerCount: raw?.CommitBooking?.BookingDetails?.Price?.PassengerBreakup?.ADT?.PassengerCount ?? null
                            }
                        }
                    },
                    Attr: raw?.CommitBooking?.BookingDetails?.Attr ?? null
                },
            }
        }
    }


    async CommitBooking(ResultToken:string){
      
        const Response=await firstValueFrom(

      this.http.post('http://test.services.travelomatix.com/webservices/index.php/flight/service/CommitBooking',
      ResultToken,
      {
        headers: {
            'Content-Type': 'application/json',
            'x-Username': 'test245274',
            'x-Password': 'test@245',
            'x-DomainKey': 'TMX3372451534825527',
            'x-System': 'test',
          },
      }
      )
        )

 
        return this.formatCommitBooking(Response.data)
    }






}







