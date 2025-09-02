import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser, UserDocument } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    // @Body() body,
    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log('Login hit', user);
    // response.send({ status: 'ok' });
    const jwt = await this.authService.login(user, response);
    response.send(jwt);
  }

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
