import React, { useEffect, useState } from 'react';
import { Contract, BrowserProvider, formatEther } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import ao01 from '../assets/data/ao01.webp';
import ao02 from '../assets/data/ao02.jpg';
import quan01 from '../assets/data/quan01.webp';
import quan02 from '../assets/data/quan02.jpg';

interface ProductDetail {
  quantity: number;
  price: number;
}

interface Product {
  id: string;
  image: string;
  alt: string;
}

export const InteractPrivateChain = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [productDetails, setProductDetails] = useState<{ [key: string]: ProductDetail }>({});

  const products: Product[] = [
    { id: "ao01", image: ao01, alt: "Áo 01" },
    { id: "ao02", image: ao02, alt: "Áo 02" },
    { id: "quan01", image: quan01, alt: "Quần 01" },
    { id: "quan02", image: quan02, alt: "Quần 02" },
  ];

  const contractABI = JSON.parse(import.meta.env.VITE_ABI_CONTRACT_PRIVATE_COMERCE);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_PRIVATE_COMERCE;

  const fetchProductDetails = async () => {
    if (!walletProvider) return;

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const contract = new Contract(contractAddress, contractABI, ethersProvider);

      const details: { [key: string]: ProductDetail } = {};

      // Fetch details for each product
      for (const product of products) {
        const [quantity, price] = await contract.getDetailProduct(product.id);
        details[product.id] = {
          quantity: Number(quantity),
          price: Number(price)
        };
        console.log('Details:', details[product.id]);
      }

      setProductDetails(details);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [walletProvider]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow">
          <img 
            src={product.image} 
            alt={product.alt} 
            className="w-full h-64 object-cover rounded-lg mb-4" 
          />
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800">
              Giá: {productDetails[product.id]?.price ? formatEther(productDetails[product.id].price) : 'Loading...'} ETH
            </div>
            <div className="text-sm text-gray-600">
              Số lượng: {productDetails[product.id]?.quantity || 'Loading...'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InteractPrivateChain;
