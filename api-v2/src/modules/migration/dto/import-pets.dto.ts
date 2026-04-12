import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LegacyPetDto {
  @IsString()
  legacyId!: string;

  @IsString()
  legacyClientId!: string;

  @IsString()
  name!: string;

  @IsString()
  species!: string;

  @IsOptional()
  @IsString()
  breed?: string;
}

export class ImportPetsDto {
  @IsString()
  tenantId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegacyPetDto)
  pets!: LegacyPetDto[];
}
