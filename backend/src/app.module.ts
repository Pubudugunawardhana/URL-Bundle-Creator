import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BundlesModule } from './bundles/bundles.module';
import { MetadataModule } from './metadata/metadata.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    BundlesModule, 
    MetadataModule,
    UsersModule,
  ],
})
export class AppModule {}
