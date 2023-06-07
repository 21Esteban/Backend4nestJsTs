import { IsString ,MinLength,IsEmail,IsOptional} from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(4)
    name:string;

    @IsEmail()
    email:string;

    @IsString()
    @MinLength(3)
    password:string

    //Si tenemos algun dato opcional

    // @IsString()
    // @IsOptional()
    // userName?: string
}
