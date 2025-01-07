import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WhatsappCronjobService {
	private readonly baseApiUrl: string;

	constructor(private readonly configService: ConfigService) {
		this.baseApiUrl = this.configService.get<string>('BASE_API_URL');
	}

	@Cron('0 9 * * * *', {
		name: 'whatsapp-cronjob',
		timeZone: 'America/Lima',
	})
	async handleCron() {
		const endpoint = `${this.baseApiUrl}/whatsapp/send-message`;

		try {
			await fetch(endpoint);
		} catch (error) {
			throw new Error(`Error in cronjob: ${error}`);
		}
	}
}
