import Data from '../database/schema/dataModel.js'


export const getRequestService = async (dealId) => {
  const data = await Data.findOne({ dealID: dealId }); // Find one get vet 1 record, voi param la dealId


  const { blockNumber, proofMerkle, ...rest } = data; // Cu phap destruct cua JS, chia ra 2 phan blockNumber va proofMerkle, con lai la rest

  return { blockNumber, proofMerkle }; // Tra ve blockNumber va proofMerkle duoi dang Oject
}