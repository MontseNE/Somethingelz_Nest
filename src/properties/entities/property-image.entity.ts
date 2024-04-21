import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from './';

@Entity()
export class PropertyImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Property,
        (property) => property.images,
        { onDelete: 'CASCADE' }
    )
    property: Property

}