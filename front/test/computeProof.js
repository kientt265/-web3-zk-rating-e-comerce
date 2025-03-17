import * as snarkjs from "snarkjs";

let rootMerkle = 9481786816471582978621498260206601135749596819625992801086595385400827592010n;
let siblingsMerkle = [
    12529056541846809529217246457372494600723992986394376628422662278812870050455n,
    4343965691150138726836739709009779088887128583775798815903906342831540709849n,
    14435695952389841705329121787475799705368560265147786064530681394982517048422n,
    14480581944113935157249768595910922624714408677536379331020440249749389126385n,
    4109670901569350840775997086470270738094016534713311173603755855620535170747n,
    3492051532847727630668236136674136437776995179045199807202047066561305666028n,
    13257911221733282532469653407639854300592169859311517010689452029842455849851n,
    4543021426871245750249134529166887076743712938121958045973994421801628690682n,
    13761808010043310001795736749831369310491525670071005836114489626640223405422n,
    249847307026210478423945971673400928338356358469971988002497062552269378479n,
    14629679841506407333712437201296291290074194035289118269686326137490253218613n,
    11393746527195701540593297129800138069265845589140174535451399799832821530226n,
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
let pubkey = [
    [
        1438049006649065200n,
        6745889054694078974n,
        505662278888901737n,
        1133911728536098580n
    ],
    [
        10292674941263306058n,
        5103077262140546580n,
        3757337685002731500n,
        10431613363190662439n
    ]
];
let dealId = 20n;
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

const calculateProof = async () => {
    const input = { 
        rootMerkle,
        siblingsMerkle,
        pubkey,
        dealId,
        r,
        s,
        msghash,
    };
    
    try {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input, 
            "./prove/zkecomerce.wasm",
            "./prove/zkecomerce_0001.zkey"
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