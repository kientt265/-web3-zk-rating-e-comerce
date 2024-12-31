import Data from '../database/schema/dataModel.js'


export const getRequestService = async (dealId) => {
  // const data = await Data.findOne({ dealID: dealId }); // Find one get vet 1 record, voi param la dealId

  const data = await Data.findOne({ dealID: dealId }); 
  const { blockNumber, proofMerkle,buyerAddress, ...rest } = data; // Cu phap destruct cua JS, chia ra 2 phan blockNumber va proofMerkle, con lai la rest

  return { blockNumber, proofMerkle, buyerAddress }; // Tra ve blockNumber va proofMerkle duoi dang Oject


}

