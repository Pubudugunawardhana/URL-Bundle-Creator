import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { customAlphabet } from 'nanoid';
import * as crypto from 'crypto';

@Injectable()
export class BundlesService {
  private nanoid = customAlphabet('346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnopqrstuvwxyz', 5);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBundleDto, userId?: string) {
    const shortId = this.nanoid();
    let hashedPassword = null;
    if (dto.password && dto.password.trim() !== '') {
      hashedPassword = crypto.createHash('sha256').update(dto.password.trim()).digest('hex');
    }

    let expiresAt: Date | null = null;
    if (dto.expiresIn === '1h') {
      expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    } else if (dto.expiresIn === '24h') {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (dto.expiresIn === '7d') {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    return this.prisma.bundle.create({
      data: {
        shortId,
        name: dto.name,
        description: dto.description || null,
        category: dto.category || null,
        icon: dto.icon || 'Folder',
        password: hashedPassword,
        expiresAt,
        userId: userId || null,
        links: {
          create: (dto.links || []).map((link, index) => ({
            url: link.url,
            title: link.title || null,
            description: link.description || null,
            favicon: link.favicon || null,
            note: link.note || null,
            order: index,
          })),
        },
      },
      include: { links: true },
    });
  }

  async getUserBundles(userId: string) {
    const bundles = await this.prisma.bundle.findMany({
      where: { userId },
      include: { links: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return bundles.map(bundle => {
      const { password, ...rest } = bundle;
      return rest;
    });
  }

  async delete(shortId: string, userId: string) {
    const bundle = await this.prisma.bundle.findUnique({
      where: { shortId },
    });

    if (!bundle) {
      throw new HttpException(
        { error: 'Bundle not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (bundle.userId !== userId) {
      throw new HttpException(
        { error: 'Unauthorized: You do not own this bundle' },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.prisma.bundle.delete({
        where: { shortId },
      });
      return { success: true };
    } catch (error) {
      throw new HttpException(
        { error: 'Failed to delete bundle' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateLinks(shortId: string, userId: string, links: any[]) {
    const bundle = await this.prisma.bundle.findUnique({
      where: { shortId },
    });

    if (!bundle) {
      throw new HttpException({ error: 'Bundle not found' }, HttpStatus.NOT_FOUND);
    }

    if (bundle.userId !== userId) {
      throw new HttpException({ error: 'Unauthorized: You do not own this bundle' }, HttpStatus.FORBIDDEN);
    }

    // Delete existing links and create new ones
    await this.prisma.link.deleteMany({
      where: { bundleId: bundle.id },
    });

    return this.prisma.bundle.update({
      where: { shortId },
      data: {
        links: {
          create: links.map((link, index) => ({
            url: link.url,
            title: link.title || null,
            description: link.description || null,
            favicon: link.favicon || null,
            note: link.note || null,
            order: index,
          })),
        },
      },
      include: { links: true },
    });
  }

  async update(shortId: string, userId: string, data: any) {
    const bundle = await this.prisma.bundle.findUnique({
      where: { shortId },
    });

    if (!bundle) {
      throw new HttpException({ error: 'Bundle not found' }, HttpStatus.NOT_FOUND);
    }

    if (bundle.userId !== userId) {
      throw new HttpException({ error: 'Unauthorized: You do not own this bundle' }, HttpStatus.FORBIDDEN);
    }

    return this.prisma.bundle.update({
      where: { shortId },
      data: {
        isFavorite: data.isFavorite,
      },
    });
  }

  async findOne(shortId: string, clientPasswordHash?: string) {
    const bundle = await this.prisma.bundle.findUnique({
      where: { shortId },
      include: {
        links: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!bundle) {
      throw new HttpException(
        { error: 'Bundle not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.bundle.update({
      where: { shortId },
      data: { views: { increment: 1 } },
    });
    bundle.views += 1;

    if (bundle.password) {
      const hasAccess = clientPasswordHash && clientPasswordHash === bundle.password;
      if (!hasAccess) {
        return {
          ...bundle,
          password: 'protected',
          links: [],
        };
      }
      return {
        ...bundle,
        password: clientPasswordHash,
      };
    }

    return {
      ...bundle,
      password: undefined,
    };
  }

  async verifyPassword(shortId: string, password?: string) {
    const bundle = await this.prisma.bundle.findUnique({
      where: { shortId },
    });

    if (!bundle) {
      throw new HttpException(
        { error: 'Bundle not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!bundle.password) {
      throw new HttpException(
        { error: 'No password set on this bundle' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!password) {
      throw new HttpException(
        { error: 'Password is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = crypto.createHash('sha256').update(password.trim()).digest('hex');

    if (bundle.password !== hashedPassword) {
      throw new HttpException(
        { error: 'Incorrect password' },
        HttpStatus.FORBIDDEN,
      );
    }

    return { success: true };
  }
}
