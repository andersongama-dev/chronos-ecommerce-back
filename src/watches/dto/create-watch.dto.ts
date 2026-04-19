import {
    IsString,
    IsEnum,
    IsDecimal,
    IsUrl,
    IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Brand, Color, Gender, Material, Style } from 'src/generated/prisma/enums';

export class CreateWatchDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(Brand)
    brand: Brand;

    @IsDecimal()
    @Type(() => Number)
    price: number;

    @IsEnum(Gender)
    gender: Gender;

    @IsEnum(Style)
    style: Style;

    @IsEnum(Material)
    caseMaterial: Material;

    @IsEnum(Material)
    strapMaterial: Material;

    @IsEnum(Color)
    strapColor: Color;

    @IsUrl()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    slug: string;
}