import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { compareSync,hashSync  } from 'bcrypt';

@Schema({
  timestamps: true,
  methods: {
    matchPassword(this: UserDocument, password: string) {
      return compareSync(password, this.password);
    },
  },
})
export class User extends Document{
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    select: false, //Este select es para  evitar que nos triga el password cuando hagamos una query o consulta a la database porque para que se la vamos a mostrar al usuario
  })
  password: string;

  matchPassword: (password: string) => boolean;
}

const userSchema = SchemaFactory.createForClass(User);

type UserDocument = HydratedDocument<User>;

//Con esto encriptamos la contraseña

userSchema.pre("save",function(){this.password=hashSync(this.password,10)})

export default userSchema;
