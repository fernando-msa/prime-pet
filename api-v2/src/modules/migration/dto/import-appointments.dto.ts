import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LegacyAppointmentDto {
  @IsString()
  legacyId!: string;

  @IsString()
  legacyClientId!: string;

  @IsString()
  legacyPetId!: string;

  @IsDateString()
  startsAt!: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}

export class ImportAppointmentsDto {
  @IsString()
  tenantId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegacyAppointmentDto)
  appointments!: LegacyAppointmentDto[];
}
