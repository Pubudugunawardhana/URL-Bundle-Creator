import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { decode } from 'next-auth/jwt';
import * as cookie from 'cookie';

@Injectable()
export class NextAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      throw new UnauthorizedException('No cookies found');
    }

    const cookies = cookie.parse(cookieHeader);
    const possibleCookies = [
      'authjs.session-token',
      '__Secure-authjs.session-token',
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
    ];

    let token = '';
    let salt = '';

    for (const name of possibleCookies) {
      if (cookies[name]) {
        token = cookies[name];
        salt = name;
        break;
      } else if (cookies[`${name}.0`]) {
        let chunkedToken = '';
        let i = 0;
        while (cookies[`${name}.${i}`]) {
          chunkedToken += cookies[`${name}.${i}`];
          i++;
        }
        token = chunkedToken;
        salt = name;
        break;
      }
    }

    if (!token) {
      throw new UnauthorizedException('No session token found');
    }

    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new UnauthorizedException('Auth secret not configured');
    }

    try {
      const decoded = await decode({
        token,
        secret,
        salt,
      });

      if (!decoded) {
        throw new UnauthorizedException('Invalid session');
      }

      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Session decryption failed');
    }
  }
}
