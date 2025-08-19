import { Request } from 'express';
import { UserDto } from '@app/common/dto';

export interface RequestWithCookies extends Request {
  Authentication?: string;
  user: UserDto;
  cookies: {
    Authentication?: string;
  };
}
