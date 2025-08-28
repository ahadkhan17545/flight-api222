import { Injectable, Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

import { TMXProvider } from './Third-party-apis/TMX-Api/tmx-provider';
// import { TboProvider } from './Third-party-apis/TBO-Api/tbo-provider';
// import { BirdProvider } from './Third-party-apis/Bird-Api/bird-provider';

@Injectable()
export class FlightProviderFactory {
  constructor(
   private readonly tmxProvider:TMXProvider
  ) {}

  getProvider(source: string) {
    switch (source.toLowerCase()) {
      case 'tmx':
        return this.tmxProvider

      // case 'tbo':
      //   return this.tboProvider;

      // case 'bird':
      //   return this.birdProvider;

      default:
        throw new Error(`Unknown provider source: ${source}`);
    }
  }
}
