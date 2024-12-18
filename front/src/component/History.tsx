import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";

interface HistoryItem {
  transactionHash: string;
  productId: string;
  blockNumber: number;
  amount: string;
  date: string;
  seller: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS_PRIVATE_COMERCE;
  const CONTRACT_ABI = (() => {
    try {
      return JSON.parse(import.meta.env.VITE_ABI_CONTRACT_PRIVATE_COMERCE || "[]");
    } catch {
      return [];
    }
  })();

  useEffect(() => {
    let dealComerce: Contract;

    const fetchPurchaseHistory = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask!");
        }

        const provider = new BrowserProvider(window.ethereum as any);
        const signer = await provider.getSigner();
        const buyerAddress = await signer.getAddress();

        dealComerce = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const filter = dealComerce.filters.DealCompleted(null, null, buyerAddress);
        const events = await dealComerce.queryFilter(filter);

        const formattedHistory = await Promise.all(
          events.map(async (event: any) => {
            const dealId = event.args?.[0];
            const amount = event.args?.[1];
            const block = await provider.getBlock(event.blockNumber);
            const deal = await dealComerce.deals(dealId);

            return {
              transactionHash: event.transactionHash,
              productId: deal.productId.toString(),
              blockNumber: event.blockNumber,
              amount: formatEther(amount),
              date: new Date((block?.timestamp || 0) * 1000).toLocaleString(),
              seller: deal.seller,
            };
          })
        );

        setHistory(formattedHistory);
        setLoading(false);

        dealComerce.on(dealComerce.filters.DealCompleted, async (dealId: string, amount: bigint, buyer: string, event: any) => {
          if (buyer === buyerAddress) {
            const deal = await dealComerce.deals(dealId);
            const block = await provider.getBlock(event.blockNumber);
            const newDeal: HistoryItem = {
              transactionHash: event.transactionHash,
              productId: deal.productId.toString(),
              blockNumber: event.blockNumber,
              amount: formatEther(amount),
              date: new Date((block?.timestamp || 0) * 1000).toLocaleString(),
              seller: deal.seller,
            };
            setHistory((prev) => [...prev, newDeal]);
          }
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Error fetching history:", errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchPurchaseHistory();

    return () => {
      if (dealComerce) {
        dealComerce.removeAllListeners();
      }
    };
  }, []);

  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow-md">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-white rounded-lg shadow-md text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Lịch Sử Mua Hàng</h2>
      {history.length === 0 ? (
        <div className="text-center text-gray-600">Chưa có giao dịch nào</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm">
              <div>TransactionHash: {item.transactionHash}</div>
              <div>ProductId: {item.productId}</div>
              <div>BlockNumber: {item.blockNumber}</div>
              <div>Amount: {item.amount} ETH</div>
              <div>Date: {item.date}</div>
              <div>Seller: {item.seller}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
