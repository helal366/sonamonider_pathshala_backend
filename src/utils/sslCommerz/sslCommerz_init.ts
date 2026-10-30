import { envVars } from "../../config/index.js";
import { v4 as uuidv4 } from "uuid";
import SSLCommerzPayment from "sslcommerz-lts";
import { BACKEND_URL } from "../../helperFunctions/helpers/helperFunctions.js";
import { findData } from "./findData.js";
import { BillingFrequency, StudentFeeType } from "#db-client";
interface ISSLCOMMERZ_INIT_PAYLOAD {
    student_id: string, 
    amount: number, 
    fee_name: StudentFeeType,
    fee_frequency:BillingFrequency
}

export const sslCommerzInit = async ({student_id, amount, fee_name, fee_frequency}:ISSLCOMMERZ_INIT_PAYLOAD) => {
  const {studentName, studentEmail, studentMobileNmber, postCode, address, thana, district, country} =
    await findData(student_id);
  const currentBackendUrl = BACKEND_URL;  //backend rul
  const store_id = envVars.SSL_COMMERZ_STORE_ID;
  const store_passwd = envVars.SSL_COMMERZ_STORE_PASSWORD;
  const isLive = envVars.NODE_ENV === "production";
  const transactionId = `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;
  const initiate = {
    store_id,
    store_passwd,
    total_amount: amount,
    currency: "BDT",
    tran_id: transactionId, // use unique tran_id for each api call
    success_url: `${currentBackendUrl}/api/payments/confirm`, // Added tracking query parameters
    fail_url: `${currentBackendUrl}/api/payments/fail`,
    cancel_url: `${currentBackendUrl}/api/payments/cancel`,
    ipn_url: `${currentBackendUrl}/ipn-success-payment`,
    // ipn_url: `${currentURL}/ipn-success-payment`,
    shipping_method: "NO",
    product_name: fee_name,
    product_category: fee_frequency,
    product_profile: "general",
    cus_name: studentName,
    cus_email: studentEmail,
    cus_add1: address ?? "Dhaka",
    cus_city: thana ?? "Dhaka",
    cus_state: district ?? "Dhaka",
    cus_postcode: postCode ?? "1000",
    cus_country: country ?? "Bangladesh",
    cus_phone: studentMobileNmber,

    // CRITICAL: Pass your relations through SSLCommerz variables
    value_a: student_id,
    // value_b: rentalRequest.tenantId,
    // value_c: rentalRequest.landlordId,
    // value_d: rentalRequest.propertyId,
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, isLive);
  const apiResponse = await sslcz.init(initiate);
  return { apiResponse, transactionId };
};