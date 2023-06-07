import { IsString ,MinLength,IsEmail,IsOptional, IsMongoId} from "class-validator";
export class CreatePostDto {
    @IsString()
    @MinLength(2)
    title:string;

    @IsString()
    @MinLength(2)
    description:string;

    @IsOptional()
    imgUrl?:string;

    @IsOptional()
    public_id?:string;

    @IsMongoId()
    @IsOptional()
    @IsString()
    user?:string

}
