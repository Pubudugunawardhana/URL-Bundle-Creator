import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, name: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
    if (!user.password) {
      throw new HttpException({ message: 'User signed up with a third-party provider' }, HttpStatus.BAD_REQUEST);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new HttpException({ message: 'Incorrect current password' }, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password updated successfully' };
  }

  async deleteProfile(userId: string) {
    // Due to Cascade deletes set in Prisma schema, deleting the user will also delete their Bundles, Links, and Sessions.
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { success: true, message: 'Profile deleted successfully' };
  }
}
