import { GetProductsResponse, GetProductsRequest, CreateProductRequest, CreateProductResponse, EditProductRequest, DeleteProductRequest } from 'types/products';
import axiosApi from './config';

const productsApi = {
  getProducts({
    query = '',
    limit = '10',
    offset = 0,
  }: GetProductsRequest): Promise<GetProductsResponse> {
    const params = new URLSearchParams({
      query: query,
      limit,
      offset: offset.toString(),
    });

    const url = `/products?${params.toString()}`;
    return axiosApi.get(url);
  },
  createProduct(data: CreateProductRequest): Promise<CreateProductResponse> {
    const url = `/products`;
    return axiosApi.post(url, data);
  },
  editProduct(data: EditProductRequest): Promise<CreateProductResponse> {
    const url = `/products/${data.id}`;
    return axiosApi.put(url, data.data);
  },
  deleteProduct(data: DeleteProductRequest): Promise<CreateProductResponse> {
    const url = `/products/${data.id}`;
    return axiosApi.delete(url);
  },
};

export default productsApi;
