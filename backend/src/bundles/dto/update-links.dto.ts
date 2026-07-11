import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLinkDto } from './create-bundle.dto';

export class UpdateLinksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links!: CreateLinkDto[];
}
