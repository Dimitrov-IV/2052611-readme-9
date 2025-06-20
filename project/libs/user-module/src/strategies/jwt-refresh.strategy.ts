import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../lib/user-config';
import { UserService } from '../lib/user/user.service';
import { RefreshTokenPayload } from '@project/shared';
import { RefreshTokenService } from '../lib/refresh-token/refresh-token.service';
import { TokenNotExistsException } from '../exceptions/token-not-exists.exception';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		@Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
		private readonly service: UserService,
		private readonly refreshTokenService: RefreshTokenService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtOptions.refreshTokenSecret,
		});
	}

	public async validate(payload: RefreshTokenPayload) {
		if (! await this.refreshTokenService.isExists(payload.tokenId)) {
			throw new TokenNotExistsException(payload.tokenId);
		}
		await this.refreshTokenService.deleteRefreshSession(payload.tokenId);
		await this.refreshTokenService.deleteExpiredRefreshTokens();
		return this.service.getUserByEmail(payload.email);
	}
}