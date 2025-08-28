import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AddHolidaysDto } from './dto/add-holidays.dto';
import {
  HolidayEvent,
  HolidayEventDocument,
} from './schema/holiday-event.schema';
import { config } from '../../config';

@Injectable()
export class CalendarService {
  private readonly nagerApi: string;

  constructor(
    @InjectModel(HolidayEvent.name)
    private holidayEventModel: Model<HolidayEventDocument>,
    private readonly httpService: HttpService
  ) {
    this.nagerApi = config.apis.dateNagerBaseUrl;
  }

  async addHolidaysToCalendar(userId: string, dto: AddHolidaysDto) {
    try {
      const { data: allHolidays } = await firstValueFrom(
        this.httpService.get(
          `${this.nagerApi}/PublicHolidays/${dto.year}/${dto.countryCode}`
        )
      );

      let holidaysToSave = allHolidays;

      if (dto.holidays && dto.holidays.length > 0) {
        const holidaySet = new Set(dto.holidays);
        holidaysToSave = allHolidays.filter((holiday: HolidayEvent) =>
          holidaySet.has(holiday.name)
        );
      }

      if (!holidaysToSave || holidaysToSave.length === 0) {
        return {
          message: 'No holidays found or matched to save.',
          savedCount: 0,
        };
      }

      const holidayDocuments = holidaysToSave.map((holiday: HolidayEvent) => ({
        userId: userId,
        name: holiday.name,
        date: new Date(holiday.date),
        countryCode: holiday.countryCode,
      }));

      const result = await this.holidayEventModel.insertMany(holidayDocuments);

      return {
        message: 'Holidays added successfully.',
        savedCount: result.length,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          {
            message: `Country code '${dto.countryCode}' not found.`,
          },
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        {
          message: 'Failed to fetch or save holidays.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
