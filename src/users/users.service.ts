import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import {Model} from 'mongoose'
import {FastifyReply} from 'fastify/fastify';
import { response } from 'src/common/helpers/Response';
import {JwtService} from '@nestjs/jwt/dist'
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()

export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel : Model<User>,

    //Importamos el servicio de jwt para hacer el token en la linea 37
    private readonly jwtService : JwtService
  ){}
    //El CreateUserDto es la data que nos va a llegar desde el cliente o el potsman , es como el req
  async create(createUserDto: CreateUserDto,reply:FastifyReply) {
    try {

      //BUSCAMOS EL EMAIL
      const {email} = createUserDto
      const user = await this.userModel.findOne({email})
      if(user){
        return response(reply,201,true,user,"El Email ya se encuentra en otro registro")
      }
      //Encriptamos la contraseña para eso vamos a la entidad o el modelo y lo hacemos (Linea 43)
        
      //Ahora guardamos en el modelo o database
     const newUser =  await this.userModel.create(createUserDto)

     const token = this.jwtService.sign({_id:newUser._id})

      return response(reply,201,true,{...newUser.toJSON(),password:null,token},"Usuario Creado correctamente")
    } catch (error:any) { 
      return this.catchMessage(reply,error,"create")
    }
  }

  async login(loginUserDto:LoginUserDto,reply:FastifyReply){
    try {
      const {password,email} = loginUserDto
      const user = await this.userModel.findOne({email}).select("+password")
    
      if (user && user.matchPassword(password)){
          const token = this.jwtService.sign({_id:user._id})
          
          return response(reply,200,true,{...user.toJSON(),password:null,token},"Bienvenido")
      }
      return response(reply,400,false,"","Email o password incorrectos")
    } catch (error:any) {
      return this.catchMessage(reply,error,"login")
    }
  }

  async findAll(reply:FastifyReply) {
   const users =await this.userModel.find()
   return response(reply,200,true,users,"Lista de usuarios")
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  
  catchMessage(reply:FastifyReply,error:any,nombreFuncion:string){
    return response(reply,500,false,"",`Error en user.service ${(nombreFuncion)} , ${error}`)
  }
}
