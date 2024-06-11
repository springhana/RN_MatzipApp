import {
  Controller,
  Body,
  Post,
  Get,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from './user.entity';
import { GetUser } from 'src/@common/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport/dist';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  @Post('/signin')
  signin(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  @Get('/refresh')
  @UseGuards(AuthGuard()) // 전력을 사용하기 위해
  refresh(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }
}
