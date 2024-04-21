import { IsEmail, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, minúscula y un número'
    })
    password: string;

    @IsString()
    @MinLength(3)
    name: string;

    isActive: boolean;

    roles: string[];

}