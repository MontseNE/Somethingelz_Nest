import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto, UpdatePropertyImageDto } from './dto/update-property.dto';
import { Property, PropertyImage } from './entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PropertyImageDto } from './dto/property-Image.dto';
import { join } from 'path';
import { In } from 'typeorm';

@Injectable()
export class PropertiesService {

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(PropertyImage)
    private readonly propertyImageRepository: Repository<PropertyImage>,
  ) { }



  async createPropertyWithImages(createPropertyDto: CreatePropertyDto, propertyImageDtos: PropertyImageDto[]) {

    try {


      const { images = [], ...propertyDetails } = createPropertyDto;

      const property = this.propertyRepository.create(propertyDetails);
      await this.propertyRepository.save(property);

      const propertyImages = await Promise.all(propertyImageDtos.map(async (imageDto) => {
        const filename = `${Date.now()}-${imageDto.filename}`;
        const propertyImage = this.propertyImageRepository.create({
          filename: filename,
          title: imageDto.title,
          property: property,
        });
        await this.propertyImageRepository.save(propertyImage);
        return propertyImage;
      }));

      property.images = propertyImages;
      await this.propertyRepository.save(property);

      return property;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create property with images.');
    }
  }


  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const properties = await this.propertyRepository.find({
      take: limit,
      skip: offset,
      relations: ['images'],
    });

    return properties.map(property => this.mapPropertyToDto(property));
  }

  async findOne(id: string) {
    const property = await this.propertyRepository.findOne({ where: { id }, relations: ['images'] });
    return this.mapPropertyToDto(property);
  }

  async findOnePlain(term: string) {
    const property = await this.propertyRepository.findOne({ where: { id: term }, relations: ['images'] });
    if (!property) {
      throw new NotFoundException(`Property with ID ${term} not found.`);
    }
    return this.mapPropertyToDto(property);
  }

  getImageName(name: string) {
    const dashIndex = name.indexOf('-');
    if (dashIndex === -1) {
      // Si no se encuentra el caracter '-', puedes devolver una cadena vacía o el string completo
      return name;
    } else {
      return name.substring(dashIndex + 1);
    }
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, removedImages: string[]) {
    try {
      const { images = [], ...toUpdate } = updatePropertyDto;

      const property = await this.propertyRepository.findOne({ where: { id }, relations: ['images'] });
      if (!property) throw new NotFoundException(`Property with id: ${id} not found`);

      // Log para debug
      console.log('Property found:', property);

      // Eliminar las imágenes especificadas
      if (removedImages && removedImages.length > 0) {
        console.log('Removing images:', removedImages);
        await this.propertyImageRepository.delete({ property, filename: In(removedImages) });
      }

      // Actualizar imágenes si hay nuevas imágenes
      if (images.length > 0) {
        console.log('Updating images:', images);
        await this.updatePropertyImages(property, images);
      }

      Object.assign(property, toUpdate);
      await this.propertyRepository.save(property);

      property.images = await this.propertyImageRepository.find({ where: { property } });

      // Log para debug
      console.log('Updated property:', property);

      return property;
    } catch (error) {
      console.error('Error updating property in service:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to update property in service.');
    }
  }

  private async updatePropertyImages(property: Property, images: UpdatePropertyImageDto[]) {
    console.log('Deleting existing images for property:', property.id);
    await this.propertyImageRepository.delete({ property });

    const propertyImages = images.map(imageDto => {
      const propertyImage = this.propertyImageRepository.create({
        filename: imageDto.filename,
        title: imageDto.title,
        property: property,
      });
      return propertyImage;
    });

    console.log('Saving new images:', propertyImages);
    await this.propertyImageRepository.save(propertyImages);
  }




  async remove(id: string) {
    const property = await this.findOne(id);

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    await this.propertyImageRepository.delete({ property });
    await this.propertyRepository.remove(property);

    return { message: `Property with ID ${id} has been successfully removed.` };
  }

  private mapPropertyToDto(property: Property): any {
    return {
      id: property.id,
      operation: property.operation,
      tipology: property.tipology,
      title: property.title,
      description: property.description,
      province: property.province,
      municipality: property.municipality,
      address: property.address,
      precio: property.precio,
      n_rooms: property.n_rooms,
      n_bathrooms: property.n_bathrooms,
      size: property.size,
      garage: property.garage,
      images: property.images.map(img => ({
        id: img.id,
        filename: img.filename,
        title: img.title,
      })),
    };
  }




  getPropertyImage(filename: string) {

    const path = join(__dirname, '../uploads', filename);

    // if (!existsSync(path))
    //   throw new BadRequestException(`No product found with image ${filename}`);

    return path;
  }
}
