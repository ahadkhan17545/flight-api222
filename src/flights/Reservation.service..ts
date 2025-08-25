import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class Reservation {
  constructor(
    private readonly http: HttpService,
    @Inject(CACHE_MANAGER) private readonly Cache_Manager: Cache
  ) {}

 
  formatHoldTicket(raw: any) {
    return {
      Status: raw?.Status ?? null,
      Message: raw?.Message ?? null,
      HoldTicket: {
        BookingDetails: {
          AppReference: raw?.HoldTicket?.BookingDetails?.AppReference ?? null,
          BookingId: raw?.HoldTicket?.BookingDetails?.BookingId ?? null,
          PNR: raw?.HoldTicket?.BookingDetails?.PNR ?? null,
          TicketingTimeLimit:
            raw?.HoldTicket?.BookingDetails?.TicketingTimeLimit ?? null,

          PassengerDetails:
            (raw?.HoldTicket?.BookingDetails?.PassengerDetails || []).map(
              (pax) => ({
                PassengerId: pax?.PassengerId ?? null,
                PassengerType: pax?.PassengerType ?? null,
                Title: pax?.Title ?? null,
                FirstName: pax?.FirstName ?? null,
                LastName: pax?.LastName ?? null,
                DateOfBirth: pax?.DateOfBirth ?? null,
                PassportNumber: pax?.PassportNumber ?? null,
                PassportExpiry: pax?.PassportExpiry ?? null,
                TicketNumber: pax?.TicketNumber ?? null,
              })
            ),

          JourneyList: {
            FlightDetails: {
              Details: (
                raw?.HoldTicket?.BookingDetails?.JourneyList?.FlightDetails
                  ?.Details ?? []
              ).map((segmentArray) =>
                segmentArray.map((segment) => ({
                  Origin: {
                    AirportCode: segment?.Origin?.AirportCode ?? null,
                    CityName: segment?.Origin?.CityName ?? null,
                    AirportName: segment?.Origin?.AirportName ?? null,
                    DateTime: segment?.Origin?.DateTime ?? null,
                    FDTV: segment?.Origin?.FDTV ?? null,
                    Terminal: segment?.Origin?.Terminal ?? null,
                  },
                  Destination: {
                    AirportCode: segment?.Destination?.AirportCode ?? null,
                    CityName: segment?.Destination?.CityName ?? null,
                    AirportName: segment?.Destination?.AirportName ?? null,
                    DateTime: segment?.Destination?.DateTime ?? null,
                    FDTV: segment?.Destination?.FDTV ?? null,
                    Terminal: segment?.Destination?.Terminal ?? null,
                  },
                  AirlinePNR: segment?.AirlinePNR ?? null,
                  OperatorCode: segment?.OperatorCode ?? null,
                  DisplayOperatorCode: segment?.DisplayOperatorCode ?? null,
                  OperatorName: segment?.OperatorName ?? null,
                  FlightNumber: segment?.FlightNumber ?? null,
                  CabinClass: segment?.CabinClass ?? null,
                  Attr: {
                    Baggage: segment?.Attr?.Baggage ?? null,
                    CabinBaggage: segment?.Attr?.CabinBaggage ?? null,
                    AvailableSeats: segment?.Attr?.AvailableSeats ?? null,
                  },
                }))
              ),
            },
          },

          Price: {
            Currency: raw?.HoldTicket?.BookingDetails?.Price?.Currency ?? null,
            TotalDisplayFare:
              raw?.HoldTicket?.BookingDetails?.Price?.TotalDisplayFare ?? null,
            PriceBreakup: {
              BasicFare:
                raw?.HoldTicket?.BookingDetails?.Price?.PriceBreakup
                  ?.BasicFare ?? null,
              Tax:
                raw?.HoldTicket?.BookingDetails?.Price?.PriceBreakup?.Tax ??
                null,
              AgentCommission:
                raw?.HoldTicket?.BookingDetails?.Price?.PriceBreakup
                  ?.AgentCommission ?? null,
              AgentTdsOnCommision:
                raw?.HoldTicket?.BookingDetails?.Price?.PriceBreakup
                  ?.AgentTdsOnCommision ?? null,
            },
            PassengerBreakup: {
              ADT: {
                BasePrice:
                  raw?.HoldTicket?.BookingDetails?.Price?.PassengerBreakup?.ADT
                    ?.BasePrice ?? null,
                Tax:
                  raw?.HoldTicket?.BookingDetails?.Price?.PassengerBreakup?.ADT
                    ?.Tax ?? null,
                TotalPrice:
                  raw?.HoldTicket?.BookingDetails?.Price?.PassengerBreakup?.ADT
                    ?.TotalPrice ?? null,
                PassengerCount:
                  raw?.HoldTicket?.BookingDetails?.Price?.PassengerBreakup?.ADT
                    ?.PassengerCount ?? null,
              },
            },
          },

          Attr: raw?.HoldTicket?.BookingDetails?.Attr ?? null,
        },
      },
    };
  }

  
  async holdTicket(requestBody: any) {
    const response = await firstValueFrom(
      this.http.post(
        "http://test.services.travelomatix.com/webservices/index.php/flight/service/HoldTicket",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "x-Username": "test245274",
            "x-Password": "test@245",
            "x-DomainKey": "TMX3372451534825527",
            "x-System": "test",
          },
        }
      )
    );

    return this.formatHoldTicket(response.data);
  }
}
