import { Controller, Get } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { whatsappData } from './whatsapp.data';
import { LV_WHATSAPP_MESSAGE_TEMPLATE } from './whatsapp.constant';
import { getFormattedDay } from 'src/utils/main.utils';

@Controller('whatsapp')
export class WhatsappController {
	constructor(private readonly whatsappService: WhatsappService) {}

	@Get('send-message')
	async sendMessage(): Promise<string[]> {
		const now = new Date();
		const formattedNowDay = getFormattedDay(now);

		return await Promise.all(
			whatsappData.map(async (data) => {
				try {
					const { roomNumber, phoneNumber, paymentDay, guest } = data;

					if (formattedNowDay === paymentDay) {
						const message = LV_WHATSAPP_MESSAGE_TEMPLATE.replace(
							'{{guest}}',
							guest,
						).replace('{{roomNumber}}', roomNumber);

						return this.whatsappService.sendMessage(phoneNumber, message);
					}
				} catch (error) {
					console.error('Error al enviar el mensaje:', error);
					throw new Error('No se pudo enviar el mensaje');
				}
			}),
		);
	}
}
