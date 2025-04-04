import React from 'react'

interface GetInputProps {
    dealId: string;
    productId: string;
    rating: string;
    address: string;
    privKey: string;
    msgHash: string;
    r: string;
    s: string;
    v: number;
    comment: string;
    images: File[];
  }
export const Test: React.FC<GetInputProps> = ({ dealId, productId, rating, address, privKey, msgHash, r, s, v,  comment, images }) => {
    console.log(r);
    console.log(s);
  return (

    <div>Test</div>
  )
}
