import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property, PropertyImage } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [
    TypeOrmModule.forFeature([Property, PropertyImage]),
    AuthModule,
  ]
})
export class PropertiesModule { }
