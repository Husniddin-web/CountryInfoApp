import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getAvailableCountries() {
    return this.countriesService.getAvailableCountries();
  }

  @Get(':countryCode')
  async getCountryInfo(@Param('countryCode') countryCode: string) {
    const countryInfo = await this.countriesService.getCountryInfo(
      countryCode.toUpperCase()
    );
    if (!countryInfo) {
      throw new NotFoundException(
        `Country with code '${countryCode}' not found.`
      );
    }
    return countryInfo;
  }
}
