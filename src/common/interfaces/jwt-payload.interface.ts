import { Role } from '../../auth/enums/role.enum';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: Role;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}
