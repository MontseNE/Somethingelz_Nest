import { IsString, IsIn, IsNumber, IsPositive, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyImage } from '../entities';

export class CreatePropertyDto {
    @IsString()
    @IsIn(['venta', 'alquiler', 'sale', 'rent'])
    operation: string;

    @IsString()
    tipology: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    province: string;

    @IsString()
    municipality: string;

    @IsString()
    address: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    precio: number;

    @IsNumber()
    @Type(() => Number)
    n_rooms: number;

    @IsNumber()
    @Type(() => Number)
    n_bathrooms: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    size: number;

    @IsBoolean()
    @Type(() => Boolean)
    garage: boolean;

    @IsArray()
    @IsOptional()
    images?: PropertyImage[];

    @IsArray()
    @IsOptional()
    titles?: string[];

    @IsArray()
    @IsOptional()
    filenames?: string[];

    @IsArray()
    @IsOptional()
    imagePaths?: string[];
}


