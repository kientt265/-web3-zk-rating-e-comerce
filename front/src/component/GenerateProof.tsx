import React, { useState } from "react";
import * as snarkjs from "snarkjs";
import { Contract, Signer } from "ethers";

interface Proof {
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
}

type PublicSignal = string[];

interface GenerateProofProps {
  rootMerkle: string;
  siblingsNode: string[];
  key: string;
  value1: string;
  value2: string;
  signer: Signer;
}

const GenerateProof: React.FC<GenerateProofProps> = ({
  rootMerkle,
  siblingsNode,
  key,
  value1,
  value2,
  signer,
}) => {
  const contractAddress =
    import.meta.env.VITE_CONTRACT_ADDRESS_VERIFY_MERKLE_TREE || "";
  const contractABI = JSON.parse(
    import.meta.env.VITE_ABI_CONTRACT_VERIFY_MERKLE_TREE || "[]"
  );

  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignal | null>(null);
  const [result, setResult] = useState<string>("");
  const [generateCall, setGenerateCall] = useState<any | null>(null);
  const [verificationResult, setVerificationResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const calculateProof = async () => {
    setResult("Generating proof...");
    setLoading(true);

    try {
      const input = {
        rootMerkle,
        siblingsNode: siblingsNode.map((node) => BigInt(node).toString()), // Ensure it's formatted correctly
        key,
        value1,
        value2,
      };

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        "./prove/testing5.wasm",
        "./prove/testing5_0001.zkey"
      );

      setProof(proof);
      setPublicSignals(publicSignals);

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

    if (!signer) {
      console.error("Signer is undefined.");
      setVerificationResult("Signer is not available.");
      return;
    }

    try {
      const { pi_a, pi_b, pi_c, finalPublicSignal } = generateCall;

      if (!contractABI) throw new Error("Contract ABI is not defined.");
      const contract = new Contract(contractAddress, contractABI, signer);

      const res = await contract.verifyProof(
        pi_a,
        pi_b,
        pi_c,
        finalPublicSignal
      );

      setVerificationResult(res ? "Verification successful!" : "Verification failed.");
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
