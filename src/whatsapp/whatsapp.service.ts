import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
	private client: Client;

	constructor() {
		this.client = new Client({
			authStrategy: new LocalAuth(),
			puppeteer: {
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			},
		});

		this.client.on('qr', (qr) => {
			console.log('Escanea este código QR para iniciar sesión:');
			qrcode.generate(qr, { small: true });
		});

		this.client.on('ready', () => {
			console.log('Cliente de WhatsApp listo.');
		});

		this.client.on('auth_failure', (msg) => {
			console.error('Fallo en la autenticación:', msg);
		});
	}

	async onModuleInit() {
		await this.client.initialize();
	}

	async sendMessage(phoneNumber: string, message: string): Promise<string> {
		try {
			const formattedPhoneNumber = `${phoneNumber}@c.us`;
			await this.client.sendMessage(formattedPhoneNumber, message);
			return `Mensaje enviado a ${phoneNumber}`;
		} catch (error) {
			console.error('Error al enviar el mensaje:', error);
			throw new Error('No se pudo enviar el mensaje');
		}
	}
}
