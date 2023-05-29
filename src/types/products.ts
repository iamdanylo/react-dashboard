import { ProductType } from 'models/product';

export type GetProductsResponse = {
  data: ProductType[];
  total: number;
};

export type GetProductsRequest = {
  query?: string;
  limit?: string;
  offset?: number;
  // sort?: string | null;
};

export type CreateProductResponse = Partial<ProductType>;

export type CreateProductRequest = {
  name: string;
  description: string;
  place: string;
  type: string;
  price: number;
  link: string;
};

export type EditProductRequest = {
  data: CreateProductRequest,
  id: string;
};

export type DeleteProductRequest = Omit<EditProductRequest, 'data'>;