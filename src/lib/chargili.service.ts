import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  Balance,
  Checkout,
  Customer,
  PaymentLink,
  Price,
  Product,
  ProductPrice,
} from './interfaces/data';
import {
  CreateCheckoutParams,
  CreateCustomerParams,
  CreatePaymentLinkParams,
  CreatePriceParams,
  CreateProductParams,
  UpdateCustomerParams,
  UpdatePaymentLinkParams,
  UpdatePriceParams,
  UpdateProductParams,
} from './interfaces/requests';
import { DeleteItemResponse, ListResponse } from './interfaces/responses';

@Injectable()
export class ChargiliService {
  constructor(private readonly httpService: HttpService) {}

  public async getBalance(): Promise<Balance> {
    const response = await lastValueFrom(
      this.httpService.get<Balance>('/balance'),
    );
    return response.data;
  }

  public async createCustomer(
    customer_data: CreateCustomerParams,
  ): Promise<Customer> {
    const response = await lastValueFrom(
      this.httpService.post<Customer>('/customers', customer_data),
    );
    return response.data;
  }

  public async getCustomer(customer_id: string): Promise<Customer> {
    const response = await lastValueFrom(
      this.httpService.get<Customer>(`/customers/${customer_id}`),
    );
    return response.data;
  }

  public async updateCustomer(
    customer_id: string,
    update_data: UpdateCustomerParams,
  ): Promise<Customer> {
    const response = await lastValueFrom(
      this.httpService.patch<Customer>(
        `/customers/${customer_id}`,
        update_data,
      ),
    );
    return response.data;
  }

  public async deleteCustomer(
    customer_id: string,
  ): Promise<DeleteItemResponse> {
    const response = await lastValueFrom(
      this.httpService.delete<DeleteItemResponse>(`/customers/${customer_id}`),
    );
    return response.data;
  }

  public async listCustomers(
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<Customer>> {
    const response = await lastValueFrom(
      this.httpService.get<Customer>('/customers', {
        params: { per_page, page },
      }),
    );
    return response.data;
  }

  public async createProduct(
    product_data: CreateProductParams,
  ): Promise<Product> {
    const response = await lastValueFrom(
      this.httpService.post<Product>('/products', product_data),
    );
    return response.data;
  }

  public async updateProduct(
    product_id: string,
    update_data: UpdateProductParams,
  ): Promise<Product> {
    const response = await lastValueFrom(
      this.httpService.post<UpdateProductParams>(
        `/products/${product_id}`,
        update_data,
      ),
    );
    return response.data;
  }

  public async getProduct(product_id: string): Promise<Product> {
    const response = await lastValueFrom(
      this.httpService.get<Product>(`/products/${product_id}`),
    );
    return response.data;
  }

  public async listProducts(
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<Product>> {
    const response = await lastValueFrom(
      this.httpService.get<Product>('/products', {
        params: { per_page, page },
      }),
    );
    return response.data;
  }

  public async deleteProduct(product_id: string): Promise<DeleteItemResponse> {
    const response = await lastValueFrom(
      this.httpService.delete<DeleteItemResponse>(`/products/${product_id}`),
    );
    return response.data;
  }

  public async getProductPrices(
    product_id: string,
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<ProductPrice>> {
    const response = await lastValueFrom(
      this.httpService.get<ListResponse<ProductPrice>>(
        `/products/${product_id}/prices`,
        {
          params: { per_page, page },
        },
      ),
    );
    return response.data;
  }

  public async createPrice(price_data: CreatePriceParams): Promise<Price> {
    const response = await lastValueFrom(
      this.httpService.post<Price>('/prices', price_data),
    );
    return response.data;
  }

  public async updatePrice(
    price_id: string,
    update_data: UpdatePriceParams,
  ): Promise<Price> {
    const response = await lastValueFrom(
      this.httpService.post<Price>(`/prices/${price_id}`, update_data),
    );
    return response.data;
  }

  public async getPrice(price_id: string): Promise<Price> {
    const response = await lastValueFrom(
      this.httpService.get<Price>(`/prices/${price_id}`),
    );
    return response.data;
  }

  public async listPrices(
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<Price>> {
    const response = await lastValueFrom(
      this.httpService.get<Price>('/prices', { params: { per_page, page } }),
    );
    return response.data;
  }

  public async createCheckout(
    checkout_data: CreateCheckoutParams,
  ): Promise<Checkout> {
    if (
      !checkout_data.success_url.startsWith('http') &&
      !checkout_data.success_url.startsWith('https')
    ) {
      throw new Error('Invalid success_url, it must begin with http or https.');
    }

    if (
      !checkout_data.items &&
      (!checkout_data.amount || !checkout_data.currency)
    ) {
      throw new Error(
        'The items field is required when amount and currency are not present.',
      );
    }

    const response = await lastValueFrom(
      this.httpService.post<Checkout>('/checkouts', checkout_data),
    );
    return response.data;
  }

  public async getCheckout(checkout_id: string): Promise<Checkout> {
    const response = await lastValueFrom(
      this.httpService.get<Checkout>(`/checkouts/${checkout_id}`),
    );
    return response.data;
  }

  public async listCheckouts(
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<Checkout>> {
    const response = await lastValueFrom(
      this.httpService.get<ListResponse<Checkout>>('/checkouts', {
        params: { per_page, page },
      }),
    );
    return response.data;
  }

  public async getCheckoutItems(
    checkout_id: string,
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<any>> {
    const response = await lastValueFrom(
      this.httpService.get<ListResponse<any>>(
        `/checkouts/${checkout_id}/items`,
        {
          params: { per_page, page },
        },
      ),
    );
    return response.data;
  }

  public async expireCheckout(checkout_id: string): Promise<Checkout> {
    const response = await lastValueFrom(
      this.httpService.post<Checkout>(`/checkouts/${checkout_id}/expire`, null),
    );
    return response.data;
  }

  public async createPaymentLink(
    payment_link_data: CreatePaymentLinkParams,
  ): Promise<PaymentLink> {
    const response = await lastValueFrom(
      this.httpService.post<CreatePaymentLinkParams>(
        '/payment-links',
        payment_link_data,
      ),
    );
    return response.data;
  }

  public async updatePaymentLink(
    payment_link_id: string,
    update_data: UpdatePaymentLinkParams,
  ): Promise<PaymentLink> {
    const response = await lastValueFrom(
      this.httpService.post<PaymentLink>(
        `/payment-links/${payment_link_id}`,
        update_data,
      ),
    );
    return response.data;
  }

  public async getPaymentLink(payment_link_id: string): Promise<PaymentLink> {
    const response = await lastValueFrom(
      this.httpService.get<PaymentLink>(`/payment-links/${payment_link_id}`),
    );
    return response.data;
  }

  public async listPaymentLinks(
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<PaymentLink>> {
    const response = await lastValueFrom(
      this.httpService.get<ListResponse<PaymentLink>>('/payment-links', {
        params: { per_page, page },
      }),
    );
    return response.data;
  }

  public async getPaymentLinkItems(
    payment_link_id: string,
    per_page: number = 10,
    page: number = 1,
  ): Promise<ListResponse<any>> {
    const response = await lastValueFrom(
      this.httpService.get<ListResponse<any>>(
        `/payment-links/${payment_link_id}/items`,
        {
          params: { per_page, page },
        },
      ),
    );
    return response.data;
  }
}
