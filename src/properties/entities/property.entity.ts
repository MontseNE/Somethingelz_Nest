import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { PropertyImage } from "./";
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Property {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    operation: string;
    @Column('text', { unique: true, })
    title: string;
    @Column('text')
    description: string;
    @Column('text')
    province: string;
    @Column('text')
    municipality: string;
    @Column('text')
    adress: string;
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

    @OneToMany(
        () => PropertyImage,
        (propertyImage) => propertyImage.property,
        { cascade: true, eager: true }
    )
    images?: PropertyImage[]


    // @ManyToMany(
    //     () => User,
    //     (user) => user.property,
    //     { eager: true }
    // )
    user: User

}
