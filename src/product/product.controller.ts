import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductCreateReqDto } from './dtos/product_create.req.dto.js';
import { ProductUpdateReqDto } from './dtos/product_update.req.dto.js';
import { ProductGetResDto } from './dtos/product_get.res.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<ProductGetResDto[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async getProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductGetResDto> {
    return await this.productService.findById(id);
  }

  @Roles('admin')
  @Post()
  async createProduct(
    @Body(new ValidationPipe({ whitelist: true }))
    product: ProductCreateReqDto,
  ): Promise<ProductGetResDto> {
    return await this.productService.create(product);
  }

  @Roles('admin')
  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    product: ProductCreateReqDto,
  ): Promise<ProductGetResDto> {
    return await this.productService.update(id, product);
  }

  @Roles('admin')
  @Patch(':id')
  async patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    product: ProductUpdateReqDto,
  ): Promise<ProductGetResDto> {
    return await this.productService.patch(id, product);
  }

  @Roles('admin')
  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductGetResDto> {
    return await this.productService.delete(id);
  }
}
