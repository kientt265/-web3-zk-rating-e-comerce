import React, { useState } from "react";
import * as snarkjs from "snarkjs";
import { Contract, Signer, ethers } from "ethers";
import { zkProofHelpers } from '../../helpers/ZKProofHelpers';


interface Proof {
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
}

type PublicSignal = string[];

interface GenerateProofProps {
  rootMerkle: string;
  siblingsNode: string[];
  r: string;
  s: string;
  v: string;
  privKey:string;
  msgHash: string;
  dealId: string;
  address: string;
  productId: string;
  rating: string;
  comment: string;
  images: File[];
  // password: string;
  // signer: Signer;
}
// rootMerkle: DONE
// siblingsMerkle:  DONE
// privatekey[4](hexa): chia 4 phần đổi thành bigInt rồi đổi ngược vị trí
// privatekeyForNullifier(hexa): đổi privkey thànhbigInt
// dealId(decimal)
// productId(hexa): đổi thành bigInt
// r[4](hexa): chia 4 phần đổi thành bigInt rồi đổi ngược vị trí
// s[4](hexa): chia 4 phần đổi thành bigInt rồi đổi ngược vị trí
// msghash[4](hexa): đổi thành bigInt
// nullifier: Được tính bằng cách Hash poseidon (privatekeyForNullifier, dealId, productId): Biết rằng phải đổi 3 biến thành bigInt trước mới hash được
//*Biết rằng chỉ privKey: không ở dạng 0x còn các biến hexa còn lại thì ở dạng 0x nhé
//===========================
//Những biến gửi kèm bằng chứng
//comment: Lưu backend
//images: Lưu backend
//rating: Lưu backend, lưu blockchain
//productId: Lưu vô sản phẩm có đánh giá này trên blockchain
//msgHash: Lưu trên blockchain và backend (Để query comment và ảnh)
//nullifier: kiểm tra trên blockchain
const GenerateProof: React.FC<GenerateProofProps> = ({
  rootMerkle,
  siblingsNode,
  r,
  s,
  v,
  privKey,
  msgHash,
  dealId,
  address,
  productId,
  rating,
  comment,
  images
  // signer,
}) => {
  const contractAddress =
    import.meta.env.VITE_CONTRACT_ADDRESS_VERIFY_MERKLE_TREE || "";
  const contractABI = JSON.parse(
    import.meta.env.VITE_ABI_CONTRACT_VERIFY_MERKLE_TREE || "[]"
  );
  const providerURL = import.meta.env.VITE_SEPOLIA_RPC_URL || "";
  const provider = new ethers.JsonRpcProvider(providerURL); 
  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignal | null>(null);
  const [result, setResult] = useState<string>("");
  const [generateCall, setGenerateCall] = useState<any | null>(null);
  const [verificationResult, setVerificationResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // LOG RA THI DUNG MA TRUYEN VAO SAI   
  const calculateProof = async () => {
    setResult("Generating proof...");
    setLoading(true);
    try {
      // Prepare ZK inputs first
      const zkInputs = await zkProofHelpers.prepareZKInputs({
        privateKey: privKey,    // without 0x
        dealId: dealId,          // decimal
        productId: productId,  // without 0x
        r: r,                  // with 0x
        s: s,                  // with 0x
        msgHash: msgHash       // with 0x
      });

      console.log("Prepared ZK inputs:", zkInputs);

      const input = {
        rootMerkle: rootMerkle,
        siblingsMerkle: siblingsNode,
        privatekey: zkInputs.privateKeyParts,
        privatekeyForNullifier: zkInputs.privateKeyForNullifier,
        dealId: zkInputs.dealId,
        productId: zkInputs.productIdBigInt,
        r: zkInputs.rParts,
        s: zkInputs.sParts,
        msghash: zkInputs.masgHashParts,
        nullifier: zkInputs.nullifier,
      };
      console.log("input@", input);
      console.time("Create ZK Proof");
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input, 
        "./prove/ZKEComerce.wasm",
        "./prove/zkxcb_1.zkey"
      );
      console.timeEnd("Create ZK Proof");

      setProof(proof);
      setPublicSignals(publicSignals);
      console.log("proof@", proof);
      console.log("publicSignals@", publicSignals);
      generateCallFromProof(proof, publicSignals);
      setResult("Proof generated successfully.");
    } catch (error) {
      console.error("Error generating proof:", error);
      setResult("Error: Unable to generate proof. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const generateCallFromProof = (proof: Proof, publicSignals: PublicSignal) => {
    try {
      const pi_a = [
        "0x" + BigInt(proof.pi_a[0]).toString(16),
        "0x" + BigInt(proof.pi_a[1]).toString(16),
      ];

      const pi_b = [
        [
          "0x" + BigInt(proof.pi_b[0][1]).toString(16),
          "0x" + BigInt(proof.pi_b[0][0]).toString(16),
        ],
        [
          "0x" + BigInt(proof.pi_b[1][1]).toString(16),
          "0x" + BigInt(proof.pi_b[1][0]).toString(16),
        ],
      ];

      const pi_c = [
        "0x" + BigInt(proof.pi_c[0]).toString(16),
        "0x" + BigInt(proof.pi_c[1]).toString(16),
      ];

      const finalPublicSignal = publicSignals.map(
        (signal) =>
          "0x" + BigInt(signal).toString(16).padStart(64, "0")
      );

      setGenerateCall({ pi_a, pi_b, pi_c, finalPublicSignal });
    } catch (error) {
      console.error("Error generating call:", error);
      setGenerateCall("Error generating call.");
    }
  };

  const VerifyProof = async () => {
    if (!generateCall) {
      setVerificationResult("No generate call available.");
      return;
    }
    try {
      const { pi_a, pi_b, pi_c, finalPublicSignal } = generateCall;
      

      // console.log("pi_a", pi_a)
      // console.log("pi_b", pi_b)
      // console.log("pi_c", pi_c)
      // console.log("finalPublicSignal", finalPublicSignal)
      if (!contractABI) throw new Error("Contract ABI is not defined.");
      const contract = new Contract(contractAddress, contractABI, provider);

      console.time("Verify Zk Proof")
      const res = await contract.verifyProof(
        pi_a,
        pi_b,
        pi_c,
        finalPublicSignal
      );
      console.timeEnd("Verify Zk Proof")
      //Những biến gửi kèm bằng chứng
//comment: Lưu backend
//images: Lưu backend
//rating: Lưu backend, lưu blockchain
//productId: Lưu vô sản phẩm có đánh giá này trên blockchain
//msgHash: Lưu trên blockchain và backend (Để query comment và ảnh)
//nullifier: kiểm tra trên blockchain
      setVerificationResult(res ? "Verification successful!" : "Verification failed.");
      // const data = {
      //   pi_a: pi_a,
      //   pi_b: pi_b,
      //   pi_c: pi_c,
      //   finalPublicSignal: finalPublicSignal,
      //   productId: productId,
      //   star: rating,
      //   comment: comment,
      //   images: images,
      //   nullifier: nullifier,
      // };
      // // console.log("dataaaaaaaaaaaaaaaaaaa", JSON.stringify(data))
      // const response = await fetch("http://localhost:3000/api/verify", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      
    } catch (error) {
      console.error("Error verifying proof:", error);
      setVerificationResult("Error: Unable to verify proof.");
    }
  };

  return (
    <div>
      <h1>Snarkjs Client Example</h1>
      <button
        onClick={calculateProof}
        className="bg-blue-400"
        disabled={loading}
      >
        {loading ? "Generating..." : "Create Proof"}
      </button>

      <pre>
        <strong>Proof:</strong>
        <code>{proof ? JSON.stringify(proof, null, 2) : "No proof generated"}</code>
      </pre>

      <pre>
        <strong>Public Signals:</strong>
        <code>
          {publicSignals
            ? JSON.stringify(publicSignals, null, 2)
            : "No public signals"}
        </code>
      </pre>

      <pre>
        <strong>Result:</strong>
        <code>{result}</code>
      </pre>

      <pre>
        <button
          onClick={() => {
            if (proof && publicSignals) {
              generateCallFromProof(proof, publicSignals);
            } else {
              setGenerateCall("Proof or public signals are not available.");
            }
          }}
          className="bg-green-400"
        >
          Generate Call
        </button>
        <code>{generateCall ? JSON.stringify(generateCall, null, 2) : "No generate call generated"}</code>
      </pre>

      <pre>
        <button onClick={VerifyProof} className="bg-red-400">
          Verify Proof
        </button>
        <code>{verificationResult}</code>
      </pre>
    </div>
  );
};

export default GenerateProof;


// sao co 2 cai siblingsMerkle ? e log o dau nua ha