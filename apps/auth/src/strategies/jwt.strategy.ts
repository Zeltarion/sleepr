import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { Injectable } from '@nestjs/common';
import { RequestWithCookies } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookies): string | null => {
          return (
            request?.cookies?.Authentication || request?.Authentication || null
          );
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId });
  }
}
