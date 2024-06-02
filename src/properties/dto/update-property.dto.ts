
import { IsArray, IsString, IsIn, IsOptional, IsNumber, IsBoolean, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class UpdatePropertyDto {
    @IsString()
    @IsOptional()
    @IsIn(['venta', 'alquiler'])
    operation?: string;

    @IsString()
    @IsOptional()
    tipology?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    province?: string;

    @IsString()
    @IsOptional()
    municipality?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    precio?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    n_rooms?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    n_bathrooms?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    size?: number;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    garage?: boolean;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdatePropertyImageDto)
    images?: UpdatePropertyImageDto[] = [];

    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // Esto valida que cada elemento del array sea una cadena
    removedImages?: string[] = [];

}
export class UpdatePropertyImageDto {
    @IsString()
    filename: string;

    @IsString()
    @IsOptional()
    title: string;
}