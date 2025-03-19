import Data from '../database/schema/ratingModel.js'



export const getRatingService = async (productId) => {
  // const data = await Data.findOne({ dealID: dealId }); // Find one get vet 1 record, voi param la dealId

  const data = await Data.findOne({ productId: productId }); 
  const {dealId, comment,...rest } = data; // Cu phap destruct cua JS, chia ra 2 phan blockNumber va proofMerkle, con lai la rest

  return {  dealId, comment}; // Tra ve blockNumber va proofMerkle duoi dang Oject


}
