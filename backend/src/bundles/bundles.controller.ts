import { Controller, Post, Get, Put, Delete, Body, Param, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { BundlesService } from './bundles.service';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateLinksDto } from './dto/update-links.dto';
import { NextAuthGuard } from '../auth/guards/next-auth.guard';
import * as cookie from 'cookie';

@Controller('bundles')
export class BundlesController {
  constructor(private bundlesService: BundlesService) {}

  @Post()
  async createBundle(@Body() dto: CreateBundleDto, @Req() req: Request) {
    if (!dto.name) {
      throw new HttpException(
        { error: 'Bundle name is required.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    let userId: string | undefined = undefined;
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
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

      if (token) {
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
        if (secret) {
          try {
            require.resolve('next-auth/jwt');
            const dynamicImport = new Function('specifier', 'return import(specifier)');
            const { decode } = await dynamicImport('next-auth/jwt');
            const decoded = await decode({ token, secret, salt });
            if (decoded) {
              userId = (decoded.id || decoded.sub) as string;
            }
          } catch (error) {
            // Ignore decryption error for optional authentication
          }
        }
      }
    }

    return this.bundlesService.create(dto, userId);
  }

  @UseGuards(NextAuthGuard)
  @Get()
  async getUserBundles(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    return this.bundlesService.getUserBundles(userId);
  }

  @UseGuards(NextAuthGuard)
  @Put(':id')
  async updateBundle(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any
  ) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    return this.bundlesService.update(id, userId, data);
  }

  @UseGuards(NextAuthGuard)
  @Delete(':id')
  async deleteBundle(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    return this.bundlesService.delete(id, userId);
  }

  @Get(':id/meta')
  async getBundleMeta(@Param('id') id: string) {
    return this.bundlesService.findMeta(id);
  }

  @Get(':id')
  async getBundle(@Param('id') id: string, @Req() req: Request) {
    let clientPasswordHash: string | undefined = undefined;
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookies = cookie.parse(cookieHeader);
      clientPasswordHash = cookies[`bundle_pass_${id}`];
    }
    return this.bundlesService.findOne(id, clientPasswordHash);
  }

  @Post(':id/verify-password')
  async verifyPassword(
    @Param('id') id: string,
    @Body() body: { password?: string },
  ) {
    return this.bundlesService.verifyPassword(id, body.password);
  }

  @UseGuards(NextAuthGuard)
  @Put(':id/links')
  async updateLinks(@Param('id') id: string, @Body() dto: UpdateLinksDto, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    return this.bundlesService.updateLinks(id, userId, dto.links);
  }
}
