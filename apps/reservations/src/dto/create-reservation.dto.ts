import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject, IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChargeDto } from '@app/common';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsOptional()
  placeId?: string;

  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
