import { Controller, Get, Query } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { GetMetadataQueryDto } from './dto/get-metadata.dto';

@Controller('metadata')
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  @Get()
  async getMetadata(@Query() query: GetMetadataQueryDto) {
    return this.metadataService.getMetadata(query.url);
  }
}
