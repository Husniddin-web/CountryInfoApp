import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/country-info-app',
  apis: {
    dateNagerBaseUrl:
      process.env.DATE_NAGER_BASE_URL || 'https://date.nager.at/api/v3',
    countriesNowBaseUrl:
      process.env.COUNTRIES_NOW_BASE_URL ||
      'https://countriesnow.space/api/v0.1',
  },
};
