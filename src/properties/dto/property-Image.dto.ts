import { IsString, IsOptional } from 'class-validator';


export class PropertyImageDto {
    @IsString()
    filename: string;

    @IsString()
    @IsOptional()
    title: string;

}
