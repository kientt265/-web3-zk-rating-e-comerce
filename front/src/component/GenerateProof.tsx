import React, { useState } from "react";
import * as snarkjs from "snarkjs";
import { Contract, Signer, ethers } from "ethers";
import { root } from "@reown/appkit/networks";

interface Proof {
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
}

type PublicSignal = string[];

interface GenerateProofProps {
  rootMerkle: string;
  siblingsNode: string[];
  key1: string;
  value1: string;
  value2: string;
  productId: string;
  rating: string;
  password: string;
  // signer: Signer;
}
// no bao loi gi  
const GenerateProof: React.FC<GenerateProofProps> = ({
  rootMerkle,
  siblingsNode,
  key1,
  value1,
  value2,
  productId,
  rating,
  password
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
    console.log("rootMerkle:@",typeof rootMerkle, rootMerkle);
    console.log("siblingsNode:@", siblingsNode); // cai node nay no tinh o dau nhi
    console.log("key1:@", key1);
    console.log("value1:@", value1);
    console.log("value2:@", value2);
    try {

      // 19276106215637265997330401575650134520637790411210210147702464783678946045070
      // 19276106215637265997330401575650134520637790411210210147702464783678946045070
      const input = {
        rootMerkle: rootMerkle,
        // siblingsMerkle: siblingsNode, // sao cho nay phai khac ten ? dủng 
        // key: key1,
        // value1: value1,
        // value2: value2,
        // rootMerkle: "9481786816471582978621498260206601135749596819625992801086595385400827592010",
      //   siblingsMerkle: [
      //     "12529056541846809529217246457372494600723992986394376628422662278812870050455",
      //     "4343965691150138726836739709009779088887128583775798815903906342831540709849",
      //     "14435695952389841705329121787475799705368560265147786064530681394982517048422",
      //     "14480581944113935157249768595910922624714408677536379331020440249749389126385",
      //     "4109670901569350840775997086470270738094016534713311173603755855620535170747",
      //     "3492051532847727630668236136674136437776995179045199807202047066561305666028",
      //     "13257911221733282532469653407639854300592169859311517010689452029842455849851",
      //     "4543021426871245750249134529166887076743712938121958045973994421801628690682",
      //     "13761808010043310001795736749831369310491525670071005836114489626640223405422",
      //     "249847307026210478423945971673400928338356358469971988002497062552269378479",
      //     "14629679841506407333712437201296291290074194035289118269686326137490253218613",
      //     "11393746527195701540593297129800138069265845589140174535451399799832821530226",
      //     "0",
      //     "0",
      //     "0",
      //     "0",
      //     "0",
      //     "0",
      //     "0",
      //     "0",
      //     "0"
      // ],
       siblingsMerkle: siblingsNode,
        // key: "20",
        // value1: "20",
        // value2: "250825070299687118886926865615334624570013855120"
        key: key1,
        value1: value1,
        value2: value2,
      };
      // console.log("input@@@@@@@@@@", input)
    //
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input, 
        "./prove/testing5.wasm",
        "./prove/testing5_0001.zkey"
      );

      setProof(proof);
      setPublicSignals(publicSignals);
      console.log("proof@", proof)
      console.log("publicSignals@", publicSignals)
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

      const res = await contract.verifyProof(
        pi_a,
        pi_b,
        pi_c,
        finalPublicSignal
      );
     
      setVerificationResult(res ? "Verification successful!" : "Verification failed.");
      const data = {
        pi_a: pi_a,
        pi_b: pi_b,
        pi_c: pi_c,
        finalPublicSignal: finalPublicSignal,
        productId: productId,
        star: rating,
      };
      // console.log("dataaaaaaaaaaaaaaaaaaa", JSON.stringify(data))
      const response = await fetch("http://localhost:3000/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
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