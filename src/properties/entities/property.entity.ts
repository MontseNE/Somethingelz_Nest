import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { PropertyImage } from "./";
import { User } from '../../auth/entities/user.entity';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { PropertyImageDto } from '../dto/property-Image.dto';


@Entity()
export class Property {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    operation: string;

    @Column('text', {
        default: ' ',
    })
    tipology: string;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @Column('text')
    province: string;

    @Column('text')
    municipality: string;

    @Column('text')
    address: string;

    @Column('numeric')
    precio: number;

    @Column('numeric')
    n_rooms: number;

    @Column('numeric')
    n_bathrooms: number;

    @Column('numeric')
    size: number;

    @Column('boolean')
    garage: boolean;

    @Column({ type: 'text', array: true, nullable: true })
    imagePaths: string[]; // Agrega el campo imagePaths aquí


    @OneToMany(() => PropertyImage, (propertyImage) => propertyImage.property, {
        cascade: true,
        eager: true,
    })
    @Type(() => PropertyImageDto)
    @ValidateNested({ each: true })
    @IsArray()
    @IsOptional()
    images?: PropertyImage[];
}
