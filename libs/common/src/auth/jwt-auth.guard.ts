import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable, Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  tap,
  timeout,
} from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { RequestWithCookies } from '../interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { User } from '@app/common/models';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithCookies>();
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const jwt =
    //   req.cookies?.Authentication ||
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   context.switchToHttp().getResponse().headers?.authentication;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    if (!jwt) throw new UnauthorizedException('No token'); // ← не false

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    try {
      const user = await firstValueFrom(
        this.authClient
          .send<User>('authenticate', { Authentication: jwt })
          .pipe(timeout(5000)),
      );

      if (!user) throw new UnauthorizedException('Invalid token');

      if (roles) {
        for (const role of roles) {
          if (!user.roles?.map((role) => role.name).includes(role)) {
            this.logger.error('Invalid role');
            throw new UnauthorizedException();
          }
        }
      }

      req.user = user;
      return true;
    } catch (e: any) {
      if (e?.status === 403) throw new ForbiddenException();
      throw new UnauthorizedException(e?.message || 'Unauthorized');
    }
  }

  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   const request = context.switchToHttp().getRequest<RequestWithCookies>();
  //   const jwt = request.cookies?.Authentication;
  //   if (!jwt) {
  //     return false;
  //   }
  //
  //   return this.authClient
  //     .send<UserDto>('authenticate', {
  //       Authentication: jwt,
  //     })
  //     .pipe(
  //       tap((res) => {
  //         request.user = res;
  //       }),
  //       map(() => true),
  //       catchError(() => of(false)),
  //     );
  //
  //   // return this.authClient
  //   //   .send<UserPayload>('authenticate', { Authentication: jwt })
  //   //   .pipe(
  //   //     map((res) => {
  //   //       request.user = res;
  //   //       return true;
  //   //     }),
  //   //     catchError(() => of(false)),
  //   //   );
  // }
}
