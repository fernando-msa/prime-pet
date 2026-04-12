import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LegacyClientDto {
  @IsString()
  legacyId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class ImportClientsDto {
  @IsString()
  tenantId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegacyClientDto)
  clients!: LegacyClientDto[];
}
