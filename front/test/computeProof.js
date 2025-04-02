

let rootMerkle = 19541431170725820390550909428451413662844930278340009917024384333154514046676n;
let siblingsMerkle = [
    20459863583539760299640000143815299824515062531940465952258751610043167364864n,
    14563934420076070820808983912605126639827576692179942369643808770826548785790n,
    1557300622643070679735623856178042601276819151312369289515364903573720914508n,
    13104719783598773957942658978036127984725081539023292931498536759030363743373n,
    20130245178219667867280119314041475549402507328380536091558726231550498760388n,
    18907352433527834170369467152461918403789516016330624853196024976744068677168n,
    16755543504752693232413590129274320800729244761795302006869467211677781900986n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n,
    0n
];
let privatekey = 
    [
        14210013077360721970n,
        18186607187082920063n,
        1927582332601960175n,
        10192605860127710382n
    ];
let privatekeyForNullifier = 63980023932720102780556961549346779818707331645738787279365345841915684044850n
let dealId = 74n;
let productId = 6844n
let r = [
    1051885214475626235n,
    7832237689765726315n,
    75385252393469622479n,
    7202504431003363136n
];
let s = [
    4881259964636138109n,
    9694467970395882079n,
    2244857773609836920n,
    3127770601498883909n
];
let msghash = [
    1691808271662566206n,
    6330424733086678303n,
    62637661352462175642n,
    7056539642018884343n
];
let nullifier = 19163750222429512225111618928127032291913171684809430336362261109070840756955n
const calculateProof = async () => {
    const input = { 
        rootMerkle,
        siblingsMerkle,
        privatekey,
        privatekeyForNullifier,
        dealId,
        productId,
        r,
        s,
        msghash,
        nullifier
    };
    
    try {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input, 
            "./ZKEComerce.wasm",
            "./zkxcb_1.zkey"
        );
        
        const callData = generateCallFromProof(proof, publicSignals);
        return { proof, publicSignals, callData };
    } catch (error) {
        console.error("Error calculating proof:", error);
        throw error;
    }
};

const generateCallFromProof = (proof, publicSignals) => {
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
            (signal) => "0x" + BigInt(signal).toString(16).padStart(64, "0")
        );

        return { pi_a, pi_b, pi_c, finalPublicSignal };
    } catch (error) {
        console.error("Error generating call:", error);
        throw error;
    }
};

// Usage example
calculateProof()
    .then(result => console.log("Proof generated:", result))
    .catch(error => console.error("Failed to generate proof:", error));