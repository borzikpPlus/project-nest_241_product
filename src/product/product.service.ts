import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { Category } from '../category/entities/category.entity.js';
import { ProductCreateReqDto } from './dtos/product_create.req.dto.js';
import { ProductUpdateReqDto } from './dtos/product_update.req.dto.js';
import { ProductGetResDto } from './dtos/product_get.res.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _repository: Repository<Product>,
    @InjectRepository(Category)
    private readonly _categoryRepository: Repository<Category>,
  ) {}

  async create(dto: ProductCreateReqDto): Promise<ProductGetResDto> {
    const category = await this.getCategory(dto.category_id);
    const product = this._repository.create({
      title: dto.title,
      price: dto.price,
      description: dto.description ?? null,
      category,
    });
    const result = await this._repository.save(product);
    return this.toDto(result);
  }

  async findAll(): Promise<ProductGetResDto[]> {
    const products = await this._repository.find({
      relations: { category: true },
      order: { id: 'ASC' },
    });
    return products.map((p: Product) => this.toDto(p));
  }

  async findById(id: number): Promise<ProductGetResDto> {
    const product = await this.getProduct(id);
    return this.toDto(product);
  }

  async update(
    id: number,
    dto: ProductCreateReqDto,
  ): Promise<ProductGetResDto> {
    const product = await this.getProduct(id);
    product.title = dto.title;
    product.price = dto.price;
    product.description = dto.description ?? null;
    product.category = await this.getCategory(dto.category_id);
    const result = await this._repository.save(product);
    return this.toDto(result);
  }

  async patch(id: number, dto: ProductUpdateReqDto): Promise<ProductGetResDto> {
    const product = await this.getProduct(id);
    if (dto.title !== undefined) {
      product.title = dto.title;
    }
    if (dto.price !== undefined) {
      product.price = dto.price;
    }
    if (dto.description !== undefined) {
      product.description = dto.description;
    }
    if (dto.category_id !== undefined) {
      product.category = await this.getCategory(dto.category_id);
    }
    const result = await this._repository.save(product);
    return this.toDto(result);
  }

  async delete(id: number): Promise<ProductGetResDto> {
    const product = await this.getProduct(id);
    const result = this.toDto(product);
    await this._repository.remove(product);
    return result;
  }

  private async getProduct(id: number): Promise<Product> {
    const product = await this._repository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private async getCategory(id: number): Promise<Category> {
    const category = await this._categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  private toDto(product: Product): ProductGetResDto {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: {
        id: product.category.id,
        title: product.category.title,
      },
    };
  }
}
