
import { ethers } from 'ethers';
import Rating from '../database/schema/ratingModel.js';

// Cấu hình địa chỉ các validator
const VALIDATORS = [
    {
        address: process.env.CONTRACT_ADDRESS_RATING,
        abi: process.env.CONTRACT_ABI_RATING
    },
    {
        address: process.env.CONTRACT_ADDRESS_RATING_2,
        abi: process.env.CONTRACT_ABI_RATING
    },
    {
        address: process.env.CONTRACT_ADDRESS_RATING_3,
        abi: process.env.CONTRACT_ABI_RATING
    },
    {
        address: process.env.CONTRACT_ADDRESS_RATING_4,
        abi: process.env.CONTRACT_ABI_RATING
    }
];

let currentValidatorIndex = 0;

// Hàm chọn validator theo round-robin
const getNextValidator = () => {
    const validator = VALIDATORS[currentValidatorIndex];
    currentValidatorIndex = (currentValidatorIndex + 1) % VALIDATORS.length;
    return validator;
};

export const verifyProofService = async (proof) => {
    const { pi_a, pi_b, pi_c, finalPublicSignal, productId, star, dealId, comment, images } = proof;
    const starNumber = Number(star);
    const provider = new ethers.JsonRpcProvider(process.env.URL_RPC_INFURA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);
  
      const ratingInfo = {
        dealId,
        productId,
        rating: starNumber,
        comment: comment || '',
        images: images || [],
        timestamp: Date.now()
    };
    const ratingHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(ratingInfo)));
    console.log('Received productId:', productId);

    // Lấy validator tiếp theo
    const validator = getNextValidator();
    const contractRating = new ethers.Contract(validator.address, validator.abi, signer);
    const nullifier = await contractRating.getNullifierByDealId(dealId)
    console.time("Rating Time")
    const ratingProduct = await contractRating.ratingProduct(starNumber, productId, nullifier, pi_a, pi_b, pi_c, finalPublicSignal, ratingHash)
    await ratingProduct.wait() //verify day
    console.timeEnd("Rating Time")
    // const contractVerify = new ethers.Contract(
    //   process.env.CONTRACT_ADDRESS_VERIFY_MERKLE_TREE,
    //   process.env.ABI_CONTRACT_VERIFY_MERKLE_TREE,
    //   signer
    // );

    // const verificationResult = await contractVerify.verifyProof(pi_a, pi_b, pi_c, finalPublicSignal);
    
    
    // console.log(verificationResult ? 'Proof is valid!' : 'Proof is invalid.');
    // console.log('Star:', typeof starNumber);


    // const contractRating = new ethers.Contract(
    //       process.env.CONTRACT_ADDRESS_RATING,
    //       process.env.CONTRACT_ABI_RATING,
    //       signer
    // );

    // if(verificationResult) {
    //                 const rating = await contractRating.ratingProduct(starNumber, productId);
    //                 await rating.wait();
    //                 const avgRating = await contractRating.getRatingProduct(productId);
    //                 return avgRating;
    //             }
    const ratingData = new Rating({
      dealId,
      productId,
      rating: starNumber,
      comment,
      images
    });
    await ratingData.save();
    return {
      verificationResult,
      productId,
      star,
      pi_a,
      pi_b,
      pi_c,
      finalPublicSignal,
    };
  };
  