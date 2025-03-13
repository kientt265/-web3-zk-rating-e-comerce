// src/components/SignUpForm.tsx
interface SignUpFormProps {
    showSignUpForm: boolean;
    setShowSignUpForm: (value: boolean) => void;
    isSeller: boolean;
    setIsSeller: (value: boolean) => void;
    shopName: string;
    setShopName: (value: string) => void;
    shopEmail: string;
    setShopEmail: (value: string) => void;
    userName: string;
    setUserName: (value: string) => void;
    userAge: string;
    setUserAge: (value: string) => void;
    userEmail: string;
    setUserEmail: (value: string) => void;
    handleSignupSeller: () => Promise<void>;
    handleSignupUser: () => Promise<void>;
    isLoading: boolean;
    isSuccess: boolean;
  }
  
  function SignUpForm({
    showSignUpForm,
    setShowSignUpForm,
    isSeller,
    setIsSeller,
    shopName,
    setShopName,
    shopEmail,
    setShopEmail,
    userName,
    setUserName,
    userAge,
    setUserAge,
    userEmail,
    setUserEmail,
    handleSignupSeller,
    handleSignupUser,
    isLoading,
    isSuccess,
  }: SignUpFormProps) {
    if (!showSignUpForm) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl mb-4">Đăng Ký</h2>
          <div className="flex gap-4 mb-8">
            <button onClick={() => setIsSeller(true)} className={`py-2 px-4 rounded-lg ${isSeller ? "bg-blue-500 text-white" : "bg-gray-200"}`}>Seller</button>
            <button onClick={() => setIsSeller(false)} className={`py-2 px-4 rounded-lg ${!isSeller ? "bg-blue-500 text-white" : "bg-gray-200"}`}>User</button>
          </div>
          {isSeller ? (
            <div>
              <input type="text" placeholder="Shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} className="border p-2 mb-2 w-full" />
              <input type="email" placeholder="Shop Email" value={shopEmail} onChange={(e) => setShopEmail(e.target.value)} className="border p-2 mb-4 w-full" />
              <button onClick={handleSignupSeller} disabled={isLoading} className="bg-blue-500 text-white py-2 px-4 rounded-lg">{isLoading ? "Processing..." : "Create Seller"}</button>
              {isSuccess && !isLoading && <p className="text-green-500 mt-2">Seller created successfully!</p>}
            </div>
          ) : (
            <div>
              <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="border p-2 mb-2 w-full" />
              <input type="number" placeholder="Your Age" value={userAge} onChange={(e) => setUserAge(e.target.value)} className="border p-2 mb-2 w-full" />
              <input type="email" placeholder="Your Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="border p-2 mb-4 w-full" />
              <button onClick={handleSignupUser} disabled={isLoading} className="bg-blue-500 text-white py-2 px-4 rounded-lg">{isLoading ? "Processing..." : "Sign Up User"}</button>
              {isSuccess && !isLoading && <p className="text-green-500 mt-2">User signed up successfully!</p>}
            </div>
          )}
          <button onClick={() => setShowSignUpForm(false)} className="mt-4 ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg">Hủy</button>
        </div>
      </div>
    );
  }
  
  export default SignUpForm;