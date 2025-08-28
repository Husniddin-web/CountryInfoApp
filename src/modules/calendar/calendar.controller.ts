import { Controller, Post, Body, Param, ValidationPipe } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AddHolidaysDto } from './dto/add-holidays.dto';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Calendar')
@Controller('users/:userId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('holidays')
  @ApiOperation({ summary: 'Add national holidays to user calendar' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID to add holidays for',
    example: '12345',
  })
  @ApiBody({ type: AddHolidaysDto })
  @ApiResponse({
    status: 201,
    description: 'Holidays successfully added to user calendar',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input (validation failed)',
  })
  async addHolidaysToCalendar(
    @Param('userId') userId: string,
    @Body(new ValidationPipe()) addHolidaysDto: AddHolidaysDto
  ) {
    return this.calendarService.addHolidaysToCalendar(userId, addHolidaysDto);
  }
}
