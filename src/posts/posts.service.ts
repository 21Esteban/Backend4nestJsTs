import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FastifyReply } from 'fastify';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import {
  subirImagenACloudinary,
  eliminarImagenCloudinary,
} from 'src/common/helpers/UploadImg';
import { response } from 'src/common/helpers/Response';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async create(
    req: any,
    reply: FastifyReply,
    file: Express.Multer.File,
    createPostDto: CreatePostDto,
  ) {
    try {
      const { title, description } = createPostDto;
      const newPost = new this.postModel({
        title,
        description,
        user: req.user._id,
      });
      if (file) {
        const { secure_url, public_id } = await subirImagenACloudinary(file);
        newPost.setImg(secure_url, public_id);
      }

      await this.postModel.create(newPost);
      return response(reply, 201, true, newPost, 'Post creado correctamente ');
    } catch (error: any) {
      return this.catchMessage(reply, error, 'create');
    }
  }

  async findAll(reply: FastifyReply) {
    try {
      const posts = await this.postModel
        .find()
        // .populate('user')
        .sort('-createdAt');

      return response(reply, 200, true, posts, 'Lista de posts');
    } catch (error: any) {
      return this.catchMessage(reply, error, 'findAll');
    }
  }

  async findOne(id: string, reply: FastifyReply) {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }
      return response(reply, 200, true, post, 'post encontrado');
    } catch (error: any) {
      console.log('entre al error', error.message);
      return this.catchMessage(reply, error, 'findOne');
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    req: any,
    reply: FastifyReply,
    file: Express.Multer.File,
  ) {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }

      if (file) {
        // post.nameImage && deleteImg(post.nameImage);
        // post.setImg(req.file.filename);
        if (post.public_id) {
          await eliminarImagenCloudinary(post.public_id);
        }

        const { secure_url, public_id } = await subirImagenACloudinary(
          req.file,
        );
        post.setImg(secure_url, public_id);
        await post.save();
      }
      await post.updateOne(UpdatePostDto);

      return response(reply, 200, true, '', 'post actualizado');
    } catch (error: any) {
      return this.catchMessage(reply, error, 'update');
    }
  }

  async remove(id: string, reply: FastifyReply) {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        return response(reply, 404, false, '', 'registro no encontrado');
      }
      // post.nameImage && deleteImg(post.nameImage);

      if (post.public_id) {
        await eliminarImagenCloudinary(post.public_id);
      }

      await post.deleteOne();

      return response(reply, 200, true, '', 'post eliminado correctamente');
    } catch (error: any) {
      return this.catchMessage(reply, error, 'remove');
    }
  }

  async listPostLogin(req:any , reply:FastifyReply) {
    try {
      const posts = await this.postModel
        .find({ user: req.user._id })
        // .populate('user')
        .sort('-createdAt');
      return response(reply, 200, true, posts, 'lista de posts del usuario logueado');
    } catch (error: any) {
      return this.catchMessage(reply, error, 'listPostLogin');
    }
  }

  catchMessage(reply: FastifyReply, error: any, nombreFuncion: string) {
    return response(
      reply,
      500,
      false,
      '',
      `Error en posts.service ${nombreFuncion} , ${error}`,
    );
  }
}
