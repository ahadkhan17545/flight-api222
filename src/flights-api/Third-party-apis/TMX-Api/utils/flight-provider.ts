

export interface FlightProviders{

    FetchFlights(searchParams:any):Promise<any>;
    FormatResponse(responseBody:any):any[];

}