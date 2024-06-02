
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class PropertyImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column({ nullable: true })
    title: string;


    @ManyToOne(() => Property, (property) => property.images, { onDelete: 'CASCADE' })
    property: Property;
}

