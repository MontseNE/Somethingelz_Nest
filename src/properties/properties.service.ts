import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property, PropertyImage } from './entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource } from 'typeorm';


@Injectable()
export class PropertiesService {

  private readonly logger = new Logger('PropertyService');


  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(PropertyImage)
    private readonly propertyImageRepository: Repository<PropertyImage>,

    private readonly dataSource: DataSource,
  ) {

  }
  async create(createPropertyDto: CreatePropertyDto) {

    try {
      const { images = [], ...propertyDetails } = createPropertyDto;

      const property = this.propertyRepository.create({
        ...propertyDetails,
        images: images.map(image => this.propertyImageRepository.create({ url: image }))

      });

      await this.propertyRepository.save(property);

      return { ...property, images: images };

    } catch (error) {

      this.handleDBExceptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const properties = await this.propertyRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    })
    return properties.map(property => ({
      ...property,
      images: property.images.map(img => img.url)
    }));
  }

  async findOne(id: string) {

    const property = await this.propertyRepository.findOneBy({ id });

    if (!property)
      throw new NotFoundException(`Property with ${id} not found`);

    return property;
  }


  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }


  async update(id: string, updatePropertyDto: UpdatePropertyDto) {

    const { images, ...toUpdate } = updatePropertyDto;

    const property = await this.propertyRepository.preload({ id, ...toUpdate });

    if (!property) throw new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(PropertyImage, { property: { id } });

        property.images = images.map(image => this.propertyImageRepository.create({ url: image })
        )
      }

      await queryRunner.manager.save(property);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const property = await this.findOne(id);
    await this.propertyRepository.remove(property);
  }


  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  // Sólo para DES o primera vez PROD
  async deleteAllProperties() {
    const query = this.propertyRepository.createQueryBuilder('property');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }
}
