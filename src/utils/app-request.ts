import { Request } from 'express';
import { User } from '../users/entities/users.model';

export interface AppRequest extends Request {
  user?: User; // Attach the User entity to the request object
  [key: string]: any; // Allow additional custom properties
}
