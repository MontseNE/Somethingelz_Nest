import { IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePropertyDto {
    @IsString()
    @IsIn(['sale', 'rent'])
    operation: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    province: string;

    @IsString()
    municipality: string;

    @IsString()
    adress: string;

    @IsNumber()
    @IsPositive()
    precio: number;

    @IsNumber()
    n_rooms: number;

    @IsNumber()
    n_bathrooms: number;

    @IsNumber()
    @IsPositive()
    size: number;

    @IsBoolean()
    garage: boolean;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
