import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    password?: string;

    @IsArray()
    @IsOptional()
    favList?: string[];
}