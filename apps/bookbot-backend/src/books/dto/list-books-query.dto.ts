import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Language, Binding, BookCondition } from '@bookbot/constants';

export class ListBooksQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @IsOptional()
  @IsArray()
  @IsEnum(Language, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(Binding, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  bindings?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(BookCondition, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  conditions?: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((s: string) => parseInt(s.trim(), 10))
      : value,
  )
  authorIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((s: string) => parseInt(s.trim(), 10))
      : value,
  )
  publisherIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceTo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearTo?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  @IsBoolean()
  inStock?: boolean;
}
