import { User } from 'shared-types';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'email' | 'name' | 'role'>;
    }
  }
}