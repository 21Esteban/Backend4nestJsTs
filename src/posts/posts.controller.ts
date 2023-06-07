import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  Res,
  UseGuards,
  UploadedFile,
  Put
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileFastifyInterceptor ,diskStorage} from 'fastify-file-interceptor';
import { fileFilter } from 'src/common/helpers/FileFilter.helper';
import { fileName } from 'src/common/helpers/FileName.helper';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from 'src/users/guard/jwt-auth.guard';
import { response } from 'src/common/helpers/Response';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  //Como vamos a recibir una archivo tambien usamos el decorador de '@nestjs/common
  @UseInterceptors(
    FileFastifyInterceptor('img', {
      fileFilter: fileFilter,
      storage: diskStorage({ destination: './uploads', filename: fileName }),
    }),
  )

  @UseGuards(JwtAuthGuard)
  create(@Req() req:any,@Res() reply:FastifyReply,@UploadedFile() file:Express.Multer.File,@Body() createPostDto: CreatePostDto) {
    if(req.fileValidationError){
      return response(reply,400,false,"",req.fileValidationError)
    }
    return this.postsService.create(req,reply,file,createPostDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Res() reply:FastifyReply) {
    return this.postsService.findAll(reply);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Res() reply:FastifyReply) {
    return this.postsService.findOne(id,reply);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  listPostLogin(@Req() req:any , @Res() reply:FastifyReply) {
    return this.postsService.listPostLogin(req,reply);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileFastifyInterceptor('img', {
      fileFilter: fileFilter,
      storage: diskStorage({ destination: './uploads', filename: fileName }),
    }),
  )
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto,@Req() req:any,@Res() reply:FastifyReply,@UploadedFile() file:Express.Multer.File) {
    return this.postsService.update(id, updatePostDto,req,reply,file);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Res() reply:FastifyReply) {
    return this.postsService.remove(id,reply);
  }
}
