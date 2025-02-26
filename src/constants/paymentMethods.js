// /**
//  * Constants for payment methods
//  * @module constants/paymentMethod
//  */

// const PAYMENT_METHODS = {
//     CREDIT_CARD: {
//       key: 'CREDIT_CARD',
//       displayName: 'Credit Card',
//       available: true
//     },
//     DEBIT_CARD: {
//       key: 'DEBIT_CARD',
//       displayName: 'Debit Card',
//       available: true
//     },
//     PAYPAL: {
//       key: 'PAYPAL',
//       displayName: 'PayPal',
//       available: true
//     },
//     APPLE_PAY: {
//       key: 'APPLE_PAY',
//       displayName: 'Apple Pay',
//       available: true
//     },
//     GOOGLE_PAY: {
//       key: 'GOOGLE_PAY',
//       displayName: 'Google Pay',
//       available: true
//     },
//     BANK_TRANSFER: {
//       key: 'BANK_TRANSFER',
//       displayName: 'Bank Transfer',
//       available: true
//     },
//     CASH_ON_DELIVERY: {
//       key: 'CASH_ON_DELIVERY',
//       displayName: 'Cash on Delivery',
//       available: true
//     },
//     CRYPTO: {
//       key: 'CRYPTO',
//       displayName: 'Cryptocurrency',
//       available: false
//     }
//   };
  
//   const ALL_PAYMENT_METHODS = Object.values(PAYMENT_METHODS).map(method => method.key);
  
//   const isValidPaymentMethod = (method) => {
//     return ALL_PAYMENT_METHODS.includes(method?.toUpperCase());
//   };
  
//   module.exports = {
//     PAYMENT_METHODS,
//     ALL_PAYMENT_METHODS,
//     isValidPaymentMethod
//   };