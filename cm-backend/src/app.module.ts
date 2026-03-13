import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import this
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [
    // Add the ConfigModule here
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    CampaignsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}