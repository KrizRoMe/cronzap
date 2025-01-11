import { Module } from '@nestjs/common';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { validationSchema } from './config/validation-schema.config';
import { AppController } from './app.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [envConfig],
			validationSchema: validationSchema,
		}),
		WhatsappModule,
	],
	controllers: [AppController],
})
export class AppModule {}
