import { ConfigService } from '@nestjs/config';

function getRabbitMQConnectionString({ user, password, host, port }): string {
	return `amqp://${user}:${password}@${host}:${port}`;
}

export function getRabbitMQOptions(optionSpace) {
	return {
		useFactory: async (config: ConfigService) => ({
			exchanges: [
				{
					name: config.get<string>(`${optionSpace}.queue`),
					type: 'direct'
				}
			],
			uri: getRabbitMQConnectionString({
				host: config.get<string>(`${optionSpace}.host`),
				password: config.get<string>(`${optionSpace}.password`),
				user: config.get<string>(`${optionSpace}.user`),
				port: config.get<string>(`${optionSpace}.port`),
			}),
			connectionInitOptions: { wait: false },
			enableControllerDiscovery: true,
		}),
		inject: [ConfigService]
	}
}