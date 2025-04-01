import { FC } from 'react';
import  PoseidonThreePara from '../helpers/PoseidonThreePara.tsx'
interface PrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (privateKey: string, nullifier: string) => void;  // Updated
  dealId: string;
  productId: string;
}

const PrivateKeyModal: FC<PrivateKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  dealId,
  productId 
}) => {
  const handleSubmit = async (e: React.FormEvent) => {  // Made async
    e.preventDefault();
    const privateKey = (e.target as any).privateKey.value;
    try {
      const nullifier = await PoseidonThreePara(privateKey, productId, dealId);
      onConfirm(privateKey, nullifier);
    } catch (error) {
      console.error('Error generating nullifier:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Nhập Private Key</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="privateKey"
            placeholder="Nhập private key của bạn"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrivateKeyModal;