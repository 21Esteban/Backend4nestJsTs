import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Res } from '@nestjs/common';
import {FastifyReply} from 'fastify/fastify';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';

//Osea que los decoradores es en realidad de donde viene esa data o de donde va a recibir la data ,si es @Body es porque va a recibir la data del body de postman 
//si es @Res es porque como va a hcaer una consulta ya luego tiene que responder , por eso el @Res
//Y el param es al momento de listar un user , osea que la info va a llegar desde Los params del postman 

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto,@Res() reply:FastifyReply) {
    return this.usersService.create(createUserDto,reply);
  }

  @Post('login')
  login(@Body() loginUserDto:LoginUserDto,@Res() reply:FastifyReply) {
    return this.usersService.login(loginUserDto,reply);
  }

  @UseGuards(JwtAuthGuard) 
  @Get()
  findAll(@Res() reply:FastifyReply) {
    return this.usersService.findAll(reply);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
