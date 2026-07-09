import { Controller, Put, Delete, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { NextAuthGuard } from '../auth/guards/next-auth.guard';

@Controller('users')
@UseGuards(NextAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  async updateProfile(@Body() body: { name: string }, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new HttpException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    if (!body.name) {
      throw new HttpException({ message: 'Name is required' }, HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateProfile(userId, body.name);
  }

  @Put('password')
  async updatePassword(@Body() body: any, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new HttpException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    if (!body.currentPassword || !body.newPassword) {
      throw new HttpException({ message: 'Current and new password are required' }, HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updatePassword(userId, body.currentPassword, body.newPassword);
  }

  @Delete('profile')
  async deleteProfile(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new HttpException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    return this.usersService.deleteProfile(userId);
  }
}
