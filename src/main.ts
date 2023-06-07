import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import {Logger,ValidationPipe} from "@nestjs/common"
import { contentParser } from 'fastify-file-interceptor';

// async function bootstrap() {
//   //Por defecto nest ejecuta express , pero lo vamos a cambiar a Fastify
//   const app = await NestFactory.create(AppModule);
//   await app.listen(4000);
// }

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger:true}),
  );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true
      })
    )
    const logger = new Logger('bootstrap')
    // console.log(process.env.PORT)

    app.register(contentParser)
    await app.listen(process.env.PORT,process.env.HOST)
    logger.error(`Servidor corriendo por el puerto ${process.env.PORT}`)
}
bootstrap();
