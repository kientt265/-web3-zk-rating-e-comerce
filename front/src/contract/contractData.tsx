export const contractAdr = "0x7522494160d702D0e7Db8E93353435776Ac5503f"
export const contractABI = [
    'function createDeal(string memory _productId, uint _amount) payable',
    'function completeDeal(uint _dealId)',
    'function getDealId(address _addressUser) view returns(uint)',
    'event DealCreated(uint dealId, address buyer, string productId, uint amount, uint value)',
    'event DealConfirmed(uint dealId)',
    'event DealCompleted(uint dealId, uint amount, address buyer)',
    'function createSeller(string memory _shopName, string memory _email)',
    'function uploadItems(string memory _productID, uint _quantityPerItem, uint _pricePerProduct)',
    'function getDetailProduct(string memory _productID) view returns(uint, uint)',
    'function SignUp(string memory _name, uint8 _age, string memory _email)',
    'event NewUser(address _address)',
    'event NewProduct(string  _productID, uint _quantityPerItem, uint _pricePerProduct)'
      ]