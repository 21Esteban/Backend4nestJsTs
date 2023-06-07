import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({
  timestamps: true,
  methods:{
    setImg(this:PostDocument,secure_url:string,public_id:string){
        this.imgUrl= secure_url;
        this.public_id = public_id
    }
  }
})
export class Post extends Document {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
  })
  description: string;

  @Prop({
    type: String,
    default:null
  })
  imgUrl: string;

  @Prop({
    type: String,
    default:null
  })
  public_id: string;

  @Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  })
  user:User

  setImg:(secure_url:string,public_id:string) => void
}

type PostDocument = HydratedDocument<Post>

const postSchema = SchemaFactory.createForClass(Post)

//Esto es ua manera de optimizar el populate pero no es necesario , solo si queremos y asi no lo tenemos que colocar en el controlador
// postSchema.pre("find",function(){
//   this.populate("user")
// })

// postSchema.pre("findOne",function(){
//   this.populate("user")
// })

//y tambien hay una forma mas avanzada de hacer lo de arriba sin necesidad d repetir tanto code 

function populateMiddleware(){
  this.populate('user')
}

postSchema.pre("find",populateMiddleware)
postSchema.pre("findOne",populateMiddleware)

export default postSchema;