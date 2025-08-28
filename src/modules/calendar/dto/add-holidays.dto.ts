import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddHolidaysDto {
  @ApiProperty({
    example: 'US',
    description: 'ISO country code (2 letters)',
  })
  @IsString()
  countryCode: string;

  @ApiProperty({
    example: 2025,
    description: 'Year to fetch holidays for',
  })
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({
    example: ["New Year's Day", 'Independence Day'],
    description: 'Optional list of holiday names to add',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  holidays?: string[];
}
