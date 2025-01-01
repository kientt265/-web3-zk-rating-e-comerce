
import { ethers } from 'ethers';


export const verifyProofService = async (proof) => {
    const { pi_a, pi_b, pi_c, finalPublicSignal, productId, star } = proof;
    const starNumber = Number(star);
    const provider = new ethers.JsonRpcProvider(process.env.URL_RPC_INFURA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);
  
    console.log('Received productId:', productId);
  
    const contractVerify = new ethers.Contract(
      process.env.CONTRACT_ADDRESS_VERIFY_MERKLE_TREE,
      process.env.ABI_CONTRACT_VERIFY_MERKLE_TREE,
      signer
    );
    
    const verificationResult = await contractVerify.verifyProof(pi_a, pi_b, pi_c, finalPublicSignal);
    
    
    console.log(verificationResult ? 'Proof is valid!' : 'Proof is invalid.');
    console.log('Star:', typeof starNumber);


    const contractRating = new ethers.Contract(
          process.env.CONTRACT_ADDRESS_RATING,
          process.env.CONTRACT_ABI_RATING,
          signer
    );

    if(verificationResult) {
                    const rating = await contractRating.ratingProduct(starNumber, productId);
                    await rating.wait();
                    const avgRating = await contractRating.getRatingProduct(productId);
                    return avgRating;
                    console.log("Proof is valid@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", avgRating);
                }
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
  