import { IsString, IsNotEmpty } from 'class-validator';

export class GetMetadataQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'URL parameter is required' })
  url!: string;
}
