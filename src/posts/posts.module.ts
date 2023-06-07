import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {MongooseModule} from '@nestjs/mongoose'
import postSchema, { Post } from './entities/post.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports:[
    MongooseModule.forFeature([
      {
        name:Post.name,
        schema:postSchema
      }
    ])
  ]
})
export class PostsModule {}
