import { Request } from 'express';
import { User } from '@app/common/models';

export interface RequestWithCookies extends Request {
  Authentication?: string;
  user: User;
  cookies: {
    Authentication?: string;
  };
}
