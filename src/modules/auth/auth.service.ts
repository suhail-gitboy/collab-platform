import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HelpersService } from 'src/helpers/helpers.service';
import { User } from './models/user-models';

import { AuthProvider } from 'src/types/types.common';


export const authProvider = {
    OTP: "OTP",
    GOOGLE: "GOOGLE",
    APPLE: "APPLE"
}
export const UserStatus = {
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED"
}
export const Roll = {
    ADMIN: "ADMIN",
    USER: "USER",
    SELLER: "SELLER"

}

@Injectable()
export class AuthService {
    constructor(private helperservice: HelpersService, @InjectModel(User) private userModel: typeof User) { }

    async SignUp(body: {
        name: string;
        phone?: string;
        email?: string;
        provider: AuthProvider;

        user_type?: string
    }) {
        const {
            name,
            phone,
            email,
            provider,
            user_type

        } = body;

        try {

            if (!provider) {
                throw new BadRequestException(
                    'Authentication provider is required',
                );
            }

            // Check if the provider is a valid provider
            if (!Object.values(authProvider).includes(provider)) {
                throw new BadRequestException(
                    'Invalid authentication provider',
                );
            }

            // User must provide either phone or email
            if (!phone && !email) {
                throw new BadRequestException(
                    'Phone or email is required',
                );
            }


            if (provider === AuthProvider.OTP && !phone) {
                throw new BadRequestException(
                    'Phone number is required for OTP authentication',
                );
            }


            if (
                (provider === AuthProvider.GOOGLE ||
                    provider === AuthProvider.APPLE) &&
                !email
            ) {
                throw new BadRequestException(
                    'Email is required for this authentication provider',
                );
            }

            // Check if a user already exists with the same phone or email

            if (phone) {
                const existingUser = await this.userModel.findOne({
                    where: { phone },
                });

                if (existingUser) {
                    throw new ConflictException('Phone number already registered');
                }
            }

            if (email) {
                const existingUser = await this.userModel.findOne({
                    where: { email },
                });

                if (existingUser) {
                    throw new ConflictException('Email already registered');
                }
            }

            // Create the new user
            const user = await this.userModel.create({
                name,
                phone: phone || null,
                email: email || null,
                auth_provider: provider,
                user_type: user_type,
                last_login_at: new Date(),
                last_seen_at: new Date(),
                is_online: true


            });


            if (phone) {
                // generate Otp
                // send to clientside
                // store in redis key as phone and value otp
            }


            // Generate access and refresh tokens here

            const accesstokens = this.helperservice.JwtGenerateAccessToken(user.id);
            const Refresh = this.helperservice.JwtRefeshtoken(user.id);


            // Create a welcome notification if required
            /*
            await this.notificationService.create({
              userId: user.id,
              type: 'WELCOME',
              message: 'Welcome to the application',
            });
            */

            // Return the registered user and assigned role
            return {
                success: true,
                message: 'User registered successfully',

                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        phone: user.phone,
                        email: user.email,
                        provider: user?.auth_provider,
                        status: user.status,
                        user_type: user.user_type,
                    },


                },

                // Add tokens here after implementing token generation
                tokens: {
                    accessToken: accesstokens,
                    refreshToken: Refresh,
                },
            };
        } catch (error) {

            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Signup error:', error);

            throw new InternalServerErrorException(
                'Something went wrong while registering the user',
            );
        }
    }


    async SignIn(body: {
        phone?: string;
        email?: string;
    }) {
        const { phone, email } = body;

        try {

            if (!phone && !email) {
                throw new BadRequestException(
                    'Phone or email is required',
                );
            }

            // Phone login
            if (phone) {
                const user = await this.userModel.findOne({
                    where: { phone },
                });

                if (!user) {
                    throw new NotFoundException(
                        'User not found with this phone number',
                    );
                }

                await user.update({
                    last_login_at: new Date(),
                    last_seen_at: new Date(),
                    is_online: true,
                });
                // Generate OTP
                // Save OTP or send it to the user
                // You can implement your OTP service here

                // await this.otpService.send(phone);

                return {
                    success: true,
                    message: 'OTP sent successfully',
                    data: {
                        userId: user.id,
                        phone: user.phone,
                    },
                };
            }

            // Email login
            if (email) {
                const user = await this.userModel.findOne({
                    where: { email },
                });

                if (!user) {
                    throw new NotFoundException(
                        'User not found with this email',
                    );
                }
                await user.update({
                    last_login_at: new Date(),
                    last_seen_at: new Date(),
                    is_online: true,
                });
                const accesstokens = this.helperservice.JwtGenerateAccessToken(user.id);
                const Refresh = this.helperservice.JwtRefeshtoken(user.id);

                return {
                    success: true,
                    message: 'Login successful',
                    data: {
                        user,
                        Refresh,
                        accesstokens
                    },
                };
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Signin error:', error);

            throw new InternalServerErrorException(
                'Something went wrong while signing in',
            );
        }
    }


    async RefreshToken(body: { refreshToken: string }) {
        const { refreshToken } = body;

        try {
            if (!refreshToken) {
                throw new BadRequestException(
                    'Refresh token is required',
                );
            }

            // Verify refresh token
            const payload =
                this.helperservice.JwtVerify(refreshToken);

            if (!payload || !payload.id) {
                throw new UnauthorizedException(
                    'Invalid refresh token',
                );
            }

            // Check if user still exists
            const user = await this.userModel.findOne({
                where: {
                    id: payload.id,
                },
            });

            if (!user) {
                throw new NotFoundException(
                    'User not found',
                );
            }

            // Generate new access token
            const accessToken =
                this.helperservice.JwtGenerateAccessToken(user.id);

            // Optional: Generate a new refresh token
            const newRefreshToken =
                this.helperservice.JwtRefeshtoken(user.id);

            return {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    user,
                    accessToken,
                    refreshToken: newRefreshToken,
                },
            };

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Refresh token error:', error);

            throw new UnauthorizedException(
                'Invalid or expired refresh token',
            );
        }
    }
}


