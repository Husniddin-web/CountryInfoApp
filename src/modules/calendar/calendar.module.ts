import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import {
  HolidayEvent,
  HolidayEventSchema,
} from './schema/holiday-event.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: HolidayEvent.name, schema: HolidayEventSchema },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
