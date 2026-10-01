import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    @Get("sign-in")
    signIn(@Body() body) {
        return this.authService.SignIn(body)
    }
    @Post("sign-up")
    signUp(@Body() body) {




        return this.authService.SignUp(body)
    }

    @Patch("forget-password/:id")
    Refreshpassword(@Param('id') id: string, @Body() password) {
        console.log(id);

    }

    @Get("refresh")
    Refreshauth(@Body() body) {
        return this.authService.RefreshToken(body)

    }



}
