import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnApplicationBootstrap {
	private client: Client;
	private initializing = false;

	constructor() {
		this.client = new Client({
			authStrategy: new LocalAuth({
				dataPath: './whatsapp-session',
			}),
			puppeteer: {
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-gpu',
					'--disable-dev-shm-usage',
				],
			},
		});

		this.client.on('qr', (qr) => {
			console.log('📲 Escanea este código QR para iniciar sesión:');
			qrcode.generate(qr, { small: true });
		});

		this.client.on('authenticated', () => {
			console.log('✅ Autenticación exitosa.');
		});

		this.client.on('ready', () => {
			console.log('🎉 Cliente de WhatsApp listo para enviar mensajes.');
		});

		this.client.on('auth_failure', (msg) => {
			console.error('❌ Fallo en la autenticación:', msg);
		});

		this.client.on('disconnected', async (reason) => {
			console.error('⚠️ Cliente desconectado:', reason);
			console.log('🔄 Reintentando inicializar...');
			await this.initializeClient();
		});

		this.client.on('loading_screen', (percent, message) => {
			console.log(`Cargando WhatsApp: ${percent}% - ${message}`);
		});
	}

	async onApplicationBootstrap() {
		console.log('🚀 Inicializando cliente de WhatsApp...');
		await this.initializeClient();
	}

	private async initializeClient() {
		if (this.initializing) return;
		this.initializing = true;

		try {
			await this.client.initialize();
		} catch (error) {
			console.error('Error al inicializar el cliente de WhatsApp:', error);
		} finally {
			this.initializing = false;
		}
	}

	async sendMessage(phoneNumber: string, message: string): Promise<string> {
		try {
			const formattedPhoneNumber = `${phoneNumber}@c.us`;
			await this.client.sendMessage(formattedPhoneNumber, message);
			return `📩 Mensaje enviado a ${phoneNumber}`;
		} catch (error) {
			console.error('Error al enviar el mensaje:', error);
			throw new Error('No se pudo enviar el mensaje');
		}
	}
}
