import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { ValidateDto } from './dto/validate.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    try {
      return await this.authService.signup(dto);
    } catch (e: any) {
      console.error('Signup API Error:', e);
      return { error: true, message: e.message, stack: e.stack, name: e.name };
    }
  }

  @Post('auth/validate')
  async validate(@Body() dto: ValidateDto) {
    return this.authService.validateUser(dto);
  }
}
