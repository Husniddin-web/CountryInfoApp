import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { CountriesModule } from './modules/countries/countries.module';
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(config.mongoUri),
    CountriesModule,
    CalendarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
