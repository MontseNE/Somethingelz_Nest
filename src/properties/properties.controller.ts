import { Request, Response } from 'express';
import { join } from 'path';
import { Req, Res, Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, InternalServerErrorException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto, UpdatePropertyImageDto } from './dto/update-property.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { PropertyImageDto } from './dto/property-Image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }


  // @Post()
  // @UseInterceptors(FilesInterceptor('images', 10, {
  //   storage: diskStorage({
  //     destination: './uploads',
  //     filename: (req, file, cb) => {
  //       const uniqueSuffix = uuidv4();
  //       const filename = `${uniqueSuffix}-${file.originalname}`;
  //       cb(null, filename);
  //     },
  //   }),
  //   limits: {
  //     fileSize: 10 * 1024 * 1024, // 10 MB
  //   },
  // }))
  // async createPropertyWithImages(
  //   @Body() createPropertyDto: CreatePropertyDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Req() req: Request // Agrega Req como un parámetro
  // ) {
  //   try {
  //     const propertyImageDtos: PropertyImageDto[] = files.map((file, index) => ({
  //       filename: file.filename,
  //       title: createPropertyDto.titles ? createPropertyDto.titles[index] : '',
  //     }));

  //     const property = await this.propertiesService.createPropertyWithImages(createPropertyDto, propertyImageDtos);

  //     // Generar rutas de las imágenes para la respuesta
  //     const imagePaths = property.imagePaths.map(filename => join(req.protocol + '://' + req.get('host'), filename)); // Utiliza req.protocol en lugar de Req.protocol

  //     return { data: { ...property, imagePaths }, message: 'Property created successfully' };
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to create property with images.');
  //   }
  // }
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        console.log(uniqueSuffix);
        const filename = `${uniqueSuffix}-${file.originalname}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  }))
  async createPropertyWithImages(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request
  ) {
    try {
      const propertyImageDtos: PropertyImageDto[] = files.map((file, index) => ({
        filename: file.filename,
        title: createPropertyDto.titles ? createPropertyDto.titles[index] : '',
      }));

      const property = await this.propertiesService.createPropertyWithImages(createPropertyDto, propertyImageDtos);

      // Generar rutas de las imágenes para la respuesta
      const imagePaths = property.images.map(image => `http://localhost:3000/uploads/${this.propertiesService.getImageName(image.filename)}`.replace(/\\/g, '/'));

      return { data: { ...property, imagePaths }, message: 'Property created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create property with images.');
    }
  }


  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @Req() req: Request) {
    try {
      const properties = await this.propertiesService.findAll(paginationDto);
      const propertiesWithImagePaths = properties.map(property => ({
        ...property,
        imagePaths: property.images.map(image => `http://localhost:3000/uploads/${this.propertiesService.getImageName(image.filename)}`.replace(/\\/g, '/'))
      }));
      return { data: propertiesWithImagePaths };
    } catch (error) {
      throw new InternalServerErrorException('Failed to find properties.');
    }
  }

  @Get('images/:filename')
  findPropertyImage(
    @Res() res: Response,
    @Param('filename') filename: string
  ) {

    const path = this.propertiesService.getPropertyImage(filename);

    res.sendFile(path);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    try {
      const property = await this.propertiesService.findOnePlain(id);
      const imagePaths = property.images.map(image => `http://localhost:3000/uploads/${this.propertiesService.getImageName(image.filename)}`.replace(/\\/g, '/'));
      return { data: { ...property, imagePaths } };
    } catch (error) {
      throw new InternalServerErrorException('Failed to find property.');
    }
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const filename = `${uniqueSuffix}-${file.originalname}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request
  ) {
    try {
      const propertyImageDtos: UpdatePropertyImageDto[] = files.map((file, index) => ({
        filename: file.filename,
        title: updatePropertyDto.images ? updatePropertyDto.images[index]?.title : '',
      }));

      const updatedPropertyDto = {
        ...updatePropertyDto,
        images: propertyImageDtos,
      };

      const property = await this.propertiesService.update(id, updatedPropertyDto, updatePropertyDto.removedImages || []);

      if (!property.images) {
        property.images = []; // Asegurarse de que property.images no sea undefined
      }

      // Generar rutas de las imágenes para la respuesta
      const imagePaths = property.images.map(image =>
        `http://localhost:3000/uploads/${this.propertiesService.getImageName(image.filename)}`.replace(/\\/g, '/')
      );

      return { data: { ...property, imagePaths }, message: 'Property updated successfully' };
    } catch (error) {
      console.error('Error updating property in controller:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to update property.');
    }
  }




  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.propertiesService.remove(id);
      return { message: `Property with ID ${id} has been successfully removed.` };
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove property.');
    }
  }
}



