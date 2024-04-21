import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from '../../properties/entities';


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    name: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];


    @Column('text', {
        array: true,
        default: []
    })
    favList: string[];

    // @ManyToMany(
    //     () => Property,
    //     (property) => property.user
    // )
    property: Property;


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}