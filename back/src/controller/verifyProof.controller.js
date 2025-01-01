
import {verifyProofService} from '../service/verifyProof.service.js';

export const verifyProofController = async (req, res) => {
  try {
    const proof = req.body;

    if (!proof || !proof.pi_a || !proof.pi_b || !proof.pi_c || !proof.finalPublicSignal || !proof.productId || proof.star === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data. Please provide all required fields.',
      });
    }

    const result = await verifyProofService(proof);

    res.status(200).json({
      success: true,
      message: 'Proof verified successfully.',
      proof, // Trả về dữ liệu ban đầu
      result, // Trả về kết quả từ verifyProofService
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
