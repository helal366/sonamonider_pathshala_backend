declare module "sslcommerz-lts" {
  export interface PaymentInitData {
    total_amount: number | string;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_state: string;
    cus_postcode: string | number;
    cus_country: string;
    cus_phone: string;
    ipn_url?: string;
    cus_add2?: string;
    cus_fax?: string;
    num_of_item?: number;
    ship_name?: string;
    ship_add1?: string;
    ship_add2?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string | number;
    ship_country?: string;
    [key: `value_${"a" | "b" | "c" | "d"}`]: string | undefined;
  }

  export interface ValidationData {
    val_id: string;
  }

  export interface RefundData {
    refund_amount: number | string;
    refund_remarks: string;
    bank_tran_id: string;
    refe_id: string;
  }

  export interface RefundQueryData {
    refund_ref_id: string;
  }

  export interface TransactionQueryBySessionIdData {
    sessionkey: string;
  }

  export interface TransactionQueryByTransactionIdData {
    tran_id: string;
  }

  export interface SSLCommerzResponse {
    GatewayPageURL?: string;
    [key: string]: unknown;
  }

  export default class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, live?: boolean);

    init(
      data: PaymentInitData,
      url?: string | false,
      method?: string,
    ): Promise<SSLCommerzResponse>;
    validate(
      data: ValidationData,
      url?: string | false,
      method?: string,
    ): Promise<SSLCommerzResponse>;
    initiateRefund(
      data: RefundData,
      url?: string | false,
      method?: string,
    ): Promise<SSLCommerzResponse>;
    refundQuery(
      data: RefundQueryData,
      url?: string | false,
      method?: string,
    ): Promise<SSLCommerzResponse>;
    transactionQueryBySessionId(
      data: TransactionQueryBySessionIdData,
      url?: string | false,
      method?: string,
    ): Promise<SSLCommerzResponse>;
    transactionQueryByTransactionId(
      data: TransactionQueryByTransactionIdData,
      url?: string | false,
      method?: string,
    ): Promise<SSLCommerzResponse>;
  }
}