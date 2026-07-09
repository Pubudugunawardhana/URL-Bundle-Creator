import { Module } from '@nestjs/common';
import { BundlesService } from './bundles.service';
import { BundlesController } from './bundles.controller';

@Module({
  providers: [BundlesService],
  controllers: [BundlesController],
})
export class BundlesModule {}
