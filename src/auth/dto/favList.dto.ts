import { IsString, IsBoolean } from 'class-validator';

export class UpdateFavListDto {
  @IsString()
  propertyId: string;

  @IsBoolean()
  add: boolean;
}