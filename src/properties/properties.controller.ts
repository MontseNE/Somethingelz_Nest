import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {

    return this.propertiesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOnePlain(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.remove(id);
  }
}
