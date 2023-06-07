import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    //Configuramos las variables de entorno
    ConfigModule.forRoot(),
    //Nos conectamos a la base de datos
    MongooseModule.forRoot(process.env.MONGO_URI),

    CommonModule,

    UsersModule,

    PostsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
