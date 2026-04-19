-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('ROLEX', 'CASIO', 'SEIKO', 'OMEGA', 'TAG_HEUER', 'TISSOT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN', 'UNISEX');

-- CreateEnum
CREATE TYPE "Style" AS ENUM ('CASUAL', 'SPORT', 'LUXURY', 'CLASSIC', 'DIVER');

-- CreateEnum
CREATE TYPE "Material" AS ENUM ('STAINLESS_STEEL', 'GOLD', 'TITANIUM', 'CERAMIC', 'LEATHER', 'RUBBER', 'METAL', 'NYLON');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BLACK', 'BROWN', 'SILVER', 'GOLD', 'BLUE');

-- CreateTable
CREATE TABLE "Watch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" "Brand" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "gender" "Gender" NOT NULL,
    "style" "Style" NOT NULL,
    "caseMaterial" "Material" NOT NULL,
    "strapMaterial" "Material" NOT NULL,
    "strapColor" "Color" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Watch_slug_key" ON "Watch"("slug");
