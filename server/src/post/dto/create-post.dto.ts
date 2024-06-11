import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { MarkerColor } from '../marker-color.enum';

export class CreatePostDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  color: MarkerColor;

  @IsString()
  address: string;

  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  score: number;

  @IsArray()
  imageUris: { uri: string }[];
}
