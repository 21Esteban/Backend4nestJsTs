import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from '@nestjs/mongoose'
import userSchema, { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import postSchema, { Post } from 'src/posts/entities/post.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService,JwtStrategy],
  imports:[
    MongooseModule.forFeature([
      {
        name:User.name,
        schema:userSchema
      },
      //asi es como importamos el modelo de los posts en tal caso que necesitemos usarlo ya luego en el servicio si lo necesitamos para algo simpelemnte lo inyectamos asi como esta el modelo de arriba y ya 
      {
        name:Post.name,
        schema:postSchema
      }
    ]),

    JwtModule.register({
      secret:"abc123",
      signOptions:{expiresIn:"6d"}
    })
  ]
})
export class UsersModule {}
