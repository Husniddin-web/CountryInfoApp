import { HttpService } from '@nestjs/axios';
import { AvailableCountry } from './types/index';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { config } from '../../config';
import { IResponse } from '../../common/types';
import { CountryInfo } from './types/countryInfo.type';

@Injectable()
export class CountriesService {
  private readonly nagerApi: string;
  private readonly countriesNowApi: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.nagerApi = config.apis.dateNagerBaseUrl;
    this.countriesNowApi = config.apis.countriesNowBaseUrl;
  }

  async getAvailableCountries(): Promise<IResponse<AvailableCountry[]>> {
    const { data } = await firstValueFrom(
      this.httpService.get<AvailableCountry[]>(
        `${this.nagerApi}/AvailableCountries`
      )
    );
    return {
      data,
      statusCode: 200,
      message: 'Countries fetched successfully',
    };
  }

  async getCountryInfo(
    countryCode: string
  ): Promise<IResponse<CountryInfo | null>> {
    try {
      const [borderCountriesRes, populationDataRes, flagUrlRes] =
        await Promise.all([
          this.getBorderCountries(countryCode),
          this.getPopulationData(countryCode),
          this.getFlagUrl(countryCode),
        ]);

      return {
        data: {
          population: populationDataRes,
          flag: flagUrlRes,
          borders: borderCountriesRes,
        },
        statusCode: 200,
        message: 'Fetched country info',
      };
    } catch (error) {
      console.error('Failed to get country info:', error.message);
      return {
        data: null,
        statusCode: 500,
        message: 'Failed to fetch country info',
      };
    }
  }

  private async getBorderCountries(countryCode: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.nagerApi}/CountryInfo/${countryCode}`)
    );
    return data.borders.map((b) => ({
      name: b.commonName,
      countryCode: b.countryCode,
    }));
  }

  private async getPopulationData(countryName: string) {
    const { data: availableCountries } = await this.getAvailableCountries();
    const country = availableCountries.find(
      (c) => c.countryCode === countryName
    );
    if (!country) return { error: 'Country not found for population data.' };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.countriesNowApi}/countries/population`, {
        country: country.name,
      })
    );
    return data.data?.populationCounts || [];
  }

  private async getFlagUrl(countryName: string) {
    const { data: availableCountries } = await this.getAvailableCountries();

    const country = availableCountries.find(
      (c) => c.countryCode === countryName
    );
    if (!country) return { error: 'Country not found for flag data.' };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.countriesNowApi}/countries/flag/images`, {
        country: country.name,
      })
    );
    return data.data?.flag || 'Not available';
  }
}
