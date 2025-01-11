import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappCronjobService } from './cronjob/whatsapp-cronjob.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule, ScheduleModule.forRoot()],
	controllers: [WhatsappController],
	providers: [WhatsappService, WhatsappCronjobService],
})
export class WhatsappModule {}
