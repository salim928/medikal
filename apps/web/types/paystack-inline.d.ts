// Type shim for @paystack/inline-js, which ships without bundled type declarations.
declare module '@paystack/inline-js' {
  interface NewTransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: Record<string, any>;
    channels?: string[];
    onSuccess?: (transaction: any) => void;
    onCancel?: () => void;
    onLoad?: (response: any) => void;
    onError?: (error: any) => void;
    [key: string]: any;
  }

  export default class PaystackPop {
    newTransaction(options: NewTransactionOptions): { close: () => void };
    resumeTransaction(accessCode: string): void;
  }
}
