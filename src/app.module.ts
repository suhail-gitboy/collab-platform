import 'dotenv/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { HelpersModule } from './helpers/helpers.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { CategoriesModule } from './modules/categories/categories.module';
import { CategoriesController } from './modules/categories/categories.controller';
import { LanguageModule } from './modules/language/language.module';
import { CreatorProfileController } from './modules/creator_profile/creator_profile.controller';
import { CreatorProfileModule } from './modules/creator_profile/creator_profile.module';
import { RBACGuard } from './common/middlewares/creator.middleware';
import CreatorProfile from './modules/creator_profile/model/model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/auth/models/user-models';
import { SocialaccountModule } from './modules/socialaccount/socialaccount.module';
import { BusinessSideModule } from './modules/business-side/business-side.module';
import { BusinessSideController } from './modules/business-side/business-side.controller';
import { SavedModule } from './modules/saved/saved.module';
import { SavedController } from './modules/saved/saved.controller';
import { PortfolioContentModule } from './modules/portfolio_content/portfolio_content.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatController } from './modules/chat/chat.controller';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentController } from './modules/payment/payment.controller';

import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

import { CreatorCollaborationModule } from './modules/creator-collaboration/creator-collaboration.module';
import { configData } from './config/configeration';


LanguageModule
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  CacheModule.register({
    isGlobal: true,

    stores: [
      createKeyv('redis://default:k3J9pQz7Lm2NcV8wRt5YxBhF1oS4Da@localhost:6379'),
    ],
    ttl: 600000,

  }),
  SequelizeModule.forFeature([User]),

  DatabaseModule.forRootAsync(),
    AuthModule,
    RedisModule,
    HelpersModule,
    PortfolioContentModule,
    BusinessSideModule,
    SocialaccountModule,

    CategoriesModule, LanguageModule, CreatorProfileModule, SavedModule, ReviewsModule, ChatModule, PaymentModule, CreatorCollaborationModule],
  controllers: [AppController],
  providers: [AppService, RBACGuard],
})
export class AppModule implements NestModule {

  configure(
    consumer: MiddlewareConsumer
  ) {
    consumer.apply(AuthMiddleware).forRoutes(
      CategoriesController, SavedController, ChatController, PaymentController

    )

  }
}
