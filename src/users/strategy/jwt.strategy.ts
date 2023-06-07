import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable,UnauthorizedException } from '@nestjs/common';
import { jwtPayload } from '../interfaces/jwt-payload';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abc123', //La clave con la que va a hacer la comparacion de ese token
    });
  }
  async validate(payload: jwtPayload) {
    const { _id } = payload;
    const user =await this.userModel.findById(_id)
    if (!user){
        throw new UnauthorizedException('Token invalido')
        console.log("No estas autorizado");
    }

    return user

  }
}
