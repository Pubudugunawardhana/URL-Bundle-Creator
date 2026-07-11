import { IsString, IsOptional, IsArray, ArrayNotEmpty, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLinkDto {
  @IsString()
  url!: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  favicon?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateBundleDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links?: CreateLinkDto[];

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsIn(['1h', '24h', '7d'])
  expiresIn?: '1h' | '24h' | '7d';
}
