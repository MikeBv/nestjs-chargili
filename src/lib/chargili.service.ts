import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError, Method } from 'axios';
import * as Joi from 'joi'; // You'll need to install Joi: npm install joi @types/joi
// Import other types and consts from your project
import { CHARGILY_LIVE_URL, CHARGILY_TEST_URL } from '../consts';
import {
  Balance,
  Checkout,
  Customer,
  PaymentLink,
  Price,
  Product,
  ProductPrice,
} from './interfaces';
import {
  CheckoutItemParams,
  CreateCheckoutParams,
  CreateCustomerParams,
  CreatePaymentLinkParams,
  CreatePriceParams,
  CreateProductParams,
  PaymentLinkItemParams,
  UpdateCustomerParams,
  UpdatePaymentLinkParams,
  UpdatePriceParams,
  UpdateProductParams,
} from './interfaces';
import { DeleteItemResponse, ListResponse } from './interfaces';

// --- Custom Chargily API Error Structure ---
interface ChargilyApiError {
  status: 'error';
  message: string;
  errors?: any;
}

// Custom Exception for API-specific errors
export class ChargilyApiException extends InternalServerErrorException {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

// Define Injection Token for Options (Best Practice)
export const CHARGILY_CLIENT_OPTIONS = 'CHARGILY_CLIENT_OPTIONS';

/**
 * Configuration options for ChargilyService.
 */
export interface ChargilyClientOptions {
  /**
   * The API key for authentication with Chargily API.
   * @type {string}
   */
  api_key: string;

  /**
   * Operating mode of the client, indicating whether to use the test or live API endpoints.
   * @type {'test' | 'live'}
   */
  mode: 'test' | 'live';
}

// ----------------------------------------------------------------------
// NESTJS SERVICE IMPLEMENTATION
// ----------------------------------------------------------------------

@Injectable()
export class ChargilyService {
  private readonly api_key: string;
  private readonly base_url: string;

  // Joi Schemas for Validation
  private createCheckoutSchema = Joi.object<CreateCheckoutParams>({
    // Only 'success_url' and the mutual exclusivity are enforced here,
    // the rest of the validation would be for all fields as per API spec.
    success_url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required()
      .messages({
        'string.uri': 'Invalid success_url, it must begin with http or https.',
      }),
    items: Joi.array().optional(),
    amount: Joi.number().optional(),
    currency: Joi.string().optional(),
  }).xor('items', 'amount'); // Ensures one of 'items' or 'amount' is present, but not both

  /**
   * Constructs a ChargilyService instance.
   * Uses dependency injection for HttpService and custom options.
   * @param {HttpService} httpService - NestJS's wrapper for Axios.
   * @param {ChargilyClientOptions} options - Configuration options including API key and mode.
   */
  constructor(
    private readonly httpService: HttpService,
    @Inject(CHARGILY_CLIENT_OPTIONS) options: ChargilyClientOptions,
  ) {
    this.api_key = options.api_key;
    this.base_url =
      options.mode === 'test' ? CHARGILY_TEST_URL : CHARGILY_LIVE_URL;
  }

  // --- Exception Handling Utility ---
  private handleError(error: AxiosError<ChargilyApiError>): never {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message =
        data.message || `Chargily API error with status ${status}`;

      switch (status) {
        case 400: // Bad Request (e.g., validation errors)
          // Consider passing 'errors' object from Chargily if available
          throw new BadRequestException(message);
        case 401: // Unauthorized (e.g., invalid API key)
        case 403: // Forbidden
          throw new UnauthorizedException(message);
        case 404: // Not Found
          throw new NotFoundException(message);
        default:
          // For 5xx errors or unexpected 4xx errors
          throw new ChargilyApiException(message, status);
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., timeout, network error)
      throw new InternalServerErrorException(
        'No response received from Chargily API.',
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new InternalServerErrorException(
        `Error setting up Chargily API request: ${error.message}`,
      );
    }
  }

  /**
   * Internal method to make requests to the Chargily API using HttpService.
   * Includes structured error handling.
   * @param {string} endpoint - The endpoint path.
   * @param {Method} method - The HTTP method.
   * @param {any} [data] - The request payload.
   * @returns {Promise<T>} - The response data.
   * @private
   */
  private async request<T>(
    endpoint: string,
    method: Method = 'GET',
    data?: any,
  ): Promise<T> {
    const url = `${this.base_url}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.api_key}`,
      'Content-Type': 'application/json',
    };

    const request$ = this.httpService
      .request<T>({
        url,
        method,
        headers,
        data, // data for POST/PATCH, params for GET query
      })
      .pipe(
        catchError((error: AxiosError<ChargilyApiError>) => {
          this.handleError(error);
          // CatchError expects to return an Observable, but handleError throws,
          // so this part is technically unreachable, but required for type safety.
          return null as any;
        }),
      );

    const response = await firstValueFrom(request$);
    return response.data;
  }

  // ----------------------------------------------------------------------
  // PUBLIC API METHODS
  // ----------------------------------------------------------------------

  /**
   * Retrieves the current balance information from the Chargily API.
   * @returns {Promise<Balance>} - A promise that resolves to the balance information.
   */
  public async getBalance(): Promise<Balance> {
    return this.request<Balance>('balance', 'GET');
  }

  // --- CUSTOMER METHODS ---

  /**
   * Creates a new customer with specified details.
   * NOTE: For full production readiness, 'customer_data' should be validated here with Joi/Class-Validator.
   * @param {CreateCustomerParams} customer_data - The data for creating a new customer.
   * @returns {Promise<Customer>} - A promise that resolves to the newly created customer.
   */
  public async createCustomer(
    customer_data: CreateCustomerParams,
  ): Promise<Customer> {
    return this.request<Customer>('customers', 'POST', customer_data);
  }

  // ... (Other Customer, Product, Price, and PaymentLink methods would follow the same pattern)

  /**
   * Fetches a customer by their unique identifier.
   * @param {string} customer_id - The ID of the customer to retrieve.
   * @returns {Promise<Customer>} - A promise that resolves to the customer details.
   */
  public async getCustomer(customer_id: string): Promise<Customer> {
    if (!customer_id) throw new BadRequestException('Customer ID is required.');
    return this.request<Customer>(`customers/${customer_id}`, 'GET');
  }

  // ----------------------------------------------------------------------
  // CHECKOUT METHODS - Demonstrating Validation
  // ----------------------------------------------------------------------

  /**
   * Creates a new checkout session with the specified details, including validation.
   * @param {CreateCheckoutParams} checkout_data - The details for the new checkout session.
   * @returns {Promise<Checkout>} The created checkout object.
   */
  public async createCheckout(
    checkout_data: CreateCheckoutParams,
  ): Promise<Checkout> {
    // 1. Validation Logic (using Joi)
    const { error } = this.createCheckoutSchema.validate(checkout_data, {
      abortEarly: false,
    });

    if (error) {
      // Map Joi validation errors to a NestJS BadRequestException
      const validationErrors = error.details.map((detail) => detail.message);
      throw new BadRequestException({
        message: 'Validation failed for checkout data.',
        errors: validationErrors,
      });
    }

    // 2. API Request
    return this.request<Checkout>('checkouts', 'POST', checkout_data);
  }

  /**
   * Retrieves details of a specific checkout session by its ID.
   * @param {string} checkout_id - The ID of the checkout session to retrieve.
   * @returns {Promise<Checkout>} The requested checkout object.
   */
  public async getCheckout(checkout_id: string): Promise<Checkout> {
    if (!checkout_id) throw new BadRequestException('Checkout ID is required.');
    return this.request<Checkout>(`checkouts/${checkout_id}`, 'GET');
  }

  // Add the remaining methods here, following the `request` pattern

  // ... (All other methods like updateCustomer, listProducts, createPrice, etc.)
}

// Example of how the Service would be configured in a NestJS Module

/*
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [
    ChargilyService,
    {
      provide: CHARGILY_CLIENT_OPTIONS,
      useValue: {
        api_key: process.env.CHARGILY_API_KEY, // Get from environment
        mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      } as ChargilyClientOptions,
    },
  ],
  exports: [ChargilyService],
})
export class ChargilyModule {}
*/
