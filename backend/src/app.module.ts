import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MetadataModule } from './metadata/metadata.module';
import { BundlesModule } from './bundles/bundles.module';

@Module({
  imports: [PrismaModule, AuthModule, MetadataModule, BundlesModule],
})
export class AppModule {}
