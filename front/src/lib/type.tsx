export type FundedEvent = {
    productID: string;
    pricePerProduct: string;
    quantityPerItem: string;
    blockNumber: number;
  }
 
export type DealEvent = {
    dealId: string;
    buyer: string;
    productID: string;
    amount: string;
    value: string;
    isCompleted: boolean;
    blockNumber: number;
}