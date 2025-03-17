// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 9754065193171932304440871356369674725172535118908990089567892175406258147874;
    uint256 constant alphay  = 8720216717813662791045938048503996299518553927372509747816952802326208328743;
    uint256 constant betax1  = 4595248342876154640864015664253596319750301145323788510979479540316612170895;
    uint256 constant betax2  = 3108281714538016817465524461605051833626334314654309316052791086548036892367;
    uint256 constant betay1  = 17871562735274885799064870389030413305172738352948291617022492860252791359664;
    uint256 constant betay2  = 4286091591539977326603825316447115243786658455523425772846941446848423135162;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 1839435978668012689603459174504870596166384753445790367689300558266108121636;
    uint256 constant deltax2 = 15873444448867361406567906250606134326306832201389193834064426771071811585061;
    uint256 constant deltay1 = 15652181210285908611184882084460143834231557614071806325341589463458838642368;
    uint256 constant deltay2 = 21760798867857284130589997733576583282605069198334518452043831421594454853424;

    
    uint256 constant IC0x = 7690096188514079114705365321923281086233845844393007504783112399604705171597;
    uint256 constant IC0y = 8603804388119410687382557935296522056752281927732997349417529724560373414946;
    
    uint256 constant IC1x = 16514141812045344303677017026572140231952471131295633582371701475803789865317;
    uint256 constant IC1y = 5192171642460529975595725699290767214295173061343345563513966833999437933080;
    
    uint256 constant IC2x = 357929849165315154156956672590526000460045945606061026081290756436660727770;
    uint256 constant IC2y = 9741035177468985334713988862049859508474133048566964762956960092053369784120;
    
    uint256 constant IC3x = 18623673807915776639148203613104720668914491144894420524764971022573935233762;
    uint256 constant IC3y = 11987765239405549078674320358516499983769379380613838916571351512927638788440;
    
    uint256 constant IC4x = 5562658249811887598467292514786019271584041851701761793079990023084808631183;
    uint256 constant IC4y = 2555219519830998002632609954042503157137659398246978449393612893981561859613;
    
    uint256 constant IC5x = 954506718296271154233339629382641424153257266886100497335061317766773215063;
    uint256 constant IC5y = 9231661244987761575989996910384082982265997941124863110991027547632676434004;
    
    uint256 constant IC6x = 17346307503537453402804176197318026334437998915284491025784188011441165827087;
    uint256 constant IC6y = 16593895663729202005673109236346778812668876825483935303908548201393667448184;
    
    uint256 constant IC7x = 20467617105992429870510877449171078478492922053462026855350869569024069279192;
    uint256 constant IC7y = 18898548774751666498137217016584605054332044767181846140706638220004518822953;
    
    uint256 constant IC8x = 11820578166269089705743193617308447208873742599477991231387887260586805348718;
    uint256 constant IC8y = 10170454233672871369597556336107924736350194332668937781438344455442671511929;
    
    uint256 constant IC9x = 8326847396278260463070771228961118128246681280539126613655495793767021893164;
    uint256 constant IC9y = 5257240020264046099417197862344936126544894900078248439434195703851724785803;
    
    uint256 constant IC10x = 6912021233572037494447883005993421814074449587766735448446111582573727022584;
    uint256 constant IC10y = 12560118151956315118191615051750040954221486467938849779911998878298762860927;
    
    uint256 constant IC11x = 15008109553927518656153024368288283933000338180330032583985265450530196817386;
    uint256 constant IC11y = 11375208259315775903428710039751960200603882744936085334459473159495291212867;
    
    uint256 constant IC12x = 5654645176943342595538979168533612624291806868809760583173977833860042522094;
    uint256 constant IC12y = 19656439267439182982658843580336691267722679920803504843112994940317069703093;
    
    uint256 constant IC13x = 21239906150239233355473944070413365455887413948014664242193035757021985284182;
    uint256 constant IC13y = 20388196641643546095371084025964947424419918224290626566032158459998193610969;
    
    uint256 constant IC14x = 20740801718082494444684596075124406897349807594366354030561035887565885221863;
    uint256 constant IC14y = 4962094114233413383965040977477353552185914024912314296160575088216010369923;
    
    uint256 constant IC15x = 14074014643293394968119910167718805511832578548862179404368372894507495920081;
    uint256 constant IC15y = 13360099796245834025608680062249412339908802439910849476505640810372515618180;
    
    uint256 constant IC16x = 1689978489430801260942446961965066950339616662499664137839562442357599581566;
    uint256 constant IC16y = 666522870810538463353765855589862001619465894741495965391098046440185705202;
    
    uint256 constant IC17x = 16640792066999570137780192505060858456080504142715273793905830635653582411910;
    uint256 constant IC17y = 10201492782547761140314158227878808470590018355647888342219440744695649498525;
    
    uint256 constant IC18x = 3014732783919960522318493480930140900379717514426911548413105278782459642854;
    uint256 constant IC18y = 4938162053955412535627759224347317846942195847925987760621259199409279967164;
    
    uint256 constant IC19x = 19060977775019659566517340357098323464075870655855190114577403178851195002974;
    uint256 constant IC19y = 3249701681409987625874656506836785589531460464472486623666545750339971694514;
    
    uint256 constant IC20x = 547564650354664573934465538237674811307601258077543365409987745284443034837;
    uint256 constant IC20y = 5909742367007905154233098823744988369427506375575896990644925591441528129038;
    
    uint256 constant IC21x = 5245691028453245133814068441368371453812305110513029843052861593804551902909;
    uint256 constant IC21y = 19247070333792429102604159906367444323893329014554514342075858564190421457458;
    
    uint256 constant IC22x = 5832204415091525238697502877369281078678630445896766601819407970851952472987;
    uint256 constant IC22y = 8069793749654412006584844577708363670542949148606879503780824347145403501478;
    
    uint256 constant IC23x = 20371328425395618128458988947447315236475462596619751676653968063617760214504;
    uint256 constant IC23y = 5450389787647717553460651584269202529574972514069146036110992800248164397370;
    
    uint256 constant IC24x = 15682981843972446117600238588214749954793263795723157111553821511006003431174;
    uint256 constant IC24y = 8031490701505524941689154423262367961110527549483959213346387479089417223557;
    
    uint256 constant IC25x = 15276694825872289940930231973322331632934175914033154762151422676771066344432;
    uint256 constant IC25y = 11539110912059463470120619776090203507900208694318827530545589974158180597303;
    
    uint256 constant IC26x = 8593358609585608431872622330929556391736413219973663868891586921014176686247;
    uint256 constant IC26y = 9877656316479958536283395101085497207949880791579136366847305699472050909464;
    
    uint256 constant IC27x = 17476401634667542315131947098238577358686184418787893342258106821858175601906;
    uint256 constant IC27y = 10933536699970681140782733945561249316298168126725282714880820135685284866013;
    
    uint256 constant IC28x = 5999299949361341742103850427802736999062056401179923994440149136119827672372;
    uint256 constant IC28y = 12014376750708771662890682636426070048663219926003778155662198047911971872129;
    
    uint256 constant IC29x = 12653240121284591790547222317545247480518567978113448779713861242943459372375;
    uint256 constant IC29y = 19521440806237047807280597091575819541593758770270733930941871353823717194735;
    
    uint256 constant IC30x = 6019902122641675620890760799368706556361169311105777312958189386639766594472;
    uint256 constant IC30y = 12465105313880549836676352963258473737831714365749054791273135558962999645505;
    
    uint256 constant IC31x = 7962756696009396513692347661767539650745949148238393013329221899400309544588;
    uint256 constant IC31y = 7779853664020297759615534274975410632470221245776610616043112458519088210580;
    
    uint256 constant IC32x = 16813373100383638378023089319085480751224298363187175209874616212985494359179;
    uint256 constant IC32y = 6141186023827201123633294727720456468632663986554253207696388408278900756193;
    
    uint256 constant IC33x = 1463258782810797090380420006117767551210068941410190712892278084855925664730;
    uint256 constant IC33y = 10718014296502938098331417176710566802389839593420615470223405827773504629990;
    
    uint256 constant IC34x = 4022208440889019700701946847011014857554272888195456351733259426255683252267;
    uint256 constant IC34y = 18394695066695203065342131661598612170905808104981791230969035068261474004940;
    
    uint256 constant IC35x = 18828552596304332188375956378874041049960865701067589581819374849122926039790;
    uint256 constant IC35y = 338388703752670734771435239096319953089481121125560209702006816136501467422;
    
    uint256 constant IC36x = 2502901557039272095991518030227969794452211688442283973930943093378771184815;
    uint256 constant IC36y = 16860411758998936830704881499067821825595774237030044087966469067745526301816;
    
    uint256 constant IC37x = 7539968555023808334054936695527563239011385722888207126855177589146109715020;
    uint256 constant IC37y = 16938578617649752593366463063016074340294917604698906701636733293196117429137;
    
    uint256 constant IC38x = 10659085378536858619505792063594245776852825196818810839584182714546524185361;
    uint256 constant IC38y = 16546719821255730309473845167759191911878233109878930035862317319681278153819;
    
    uint256 constant IC39x = 8136893798498584686094395832636258430242375746991152589990573806505634147257;
    uint256 constant IC39y = 17168659512057456422033277992195572972817111555435680967949066189247963494825;
    
    uint256 constant IC40x = 3541606001150075339346058379087453143171615388484644137511938742482934554673;
    uint256 constant IC40y = 6437437583093279897876678742709034049284531071224549314501218010125406079197;
    
    uint256 constant IC41x = 17138527523945903937620088668939726328731047322858753358198244735412056369297;
    uint256 constant IC41y = 6303614458900777980354290288528271795288311112349639581482573781496162919791;
    
    uint256 constant IC42x = 5004065877464186336050713873968433005931557291711042975790037661011716325589;
    uint256 constant IC42y = 10665658998121296675161968016042205255722592335279044864976252288796947372780;
    
    uint256 constant IC43x = 14348344674670194343221288918434267982664215933913014412340636926914118543718;
    uint256 constant IC43y = 11885474136293350515374619204378784833021520123849219786180974275221859880854;
    
    uint256 constant IC44x = 9835170746179639951305931826118081218031749238201903983547421365799311011090;
    uint256 constant IC44y = 21537697114824247523270982692749036336643019313002275503632515073715319746153;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[44] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, r)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                
                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))
                
                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))
                
                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))
                
                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))
                
                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))
                
                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))
                
                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))
                
                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))
                
                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))
                
                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))
                
                g1_mulAccC(_pVk, IC13x, IC13y, calldataload(add(pubSignals, 384)))
                
                g1_mulAccC(_pVk, IC14x, IC14y, calldataload(add(pubSignals, 416)))
                
                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))
                
                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))
                
                g1_mulAccC(_pVk, IC17x, IC17y, calldataload(add(pubSignals, 512)))
                
                g1_mulAccC(_pVk, IC18x, IC18y, calldataload(add(pubSignals, 544)))
                
                g1_mulAccC(_pVk, IC19x, IC19y, calldataload(add(pubSignals, 576)))
                
                g1_mulAccC(_pVk, IC20x, IC20y, calldataload(add(pubSignals, 608)))
                
                g1_mulAccC(_pVk, IC21x, IC21y, calldataload(add(pubSignals, 640)))
                
                g1_mulAccC(_pVk, IC22x, IC22y, calldataload(add(pubSignals, 672)))
                
                g1_mulAccC(_pVk, IC23x, IC23y, calldataload(add(pubSignals, 704)))
                
                g1_mulAccC(_pVk, IC24x, IC24y, calldataload(add(pubSignals, 736)))
                
                g1_mulAccC(_pVk, IC25x, IC25y, calldataload(add(pubSignals, 768)))
                
                g1_mulAccC(_pVk, IC26x, IC26y, calldataload(add(pubSignals, 800)))
                
                g1_mulAccC(_pVk, IC27x, IC27y, calldataload(add(pubSignals, 832)))
                
                g1_mulAccC(_pVk, IC28x, IC28y, calldataload(add(pubSignals, 864)))
                
                g1_mulAccC(_pVk, IC29x, IC29y, calldataload(add(pubSignals, 896)))
                
                g1_mulAccC(_pVk, IC30x, IC30y, calldataload(add(pubSignals, 928)))
                
                g1_mulAccC(_pVk, IC31x, IC31y, calldataload(add(pubSignals, 960)))
                
                g1_mulAccC(_pVk, IC32x, IC32y, calldataload(add(pubSignals, 992)))
                
                g1_mulAccC(_pVk, IC33x, IC33y, calldataload(add(pubSignals, 1024)))
                
                g1_mulAccC(_pVk, IC34x, IC34y, calldataload(add(pubSignals, 1056)))
                
                g1_mulAccC(_pVk, IC35x, IC35y, calldataload(add(pubSignals, 1088)))
                
                g1_mulAccC(_pVk, IC36x, IC36y, calldataload(add(pubSignals, 1120)))
                
                g1_mulAccC(_pVk, IC37x, IC37y, calldataload(add(pubSignals, 1152)))
                
                g1_mulAccC(_pVk, IC38x, IC38y, calldataload(add(pubSignals, 1184)))
                
                g1_mulAccC(_pVk, IC39x, IC39y, calldataload(add(pubSignals, 1216)))
                
                g1_mulAccC(_pVk, IC40x, IC40y, calldataload(add(pubSignals, 1248)))
                
                g1_mulAccC(_pVk, IC41x, IC41y, calldataload(add(pubSignals, 1280)))
                
                g1_mulAccC(_pVk, IC42x, IC42y, calldataload(add(pubSignals, 1312)))
                
                g1_mulAccC(_pVk, IC43x, IC43y, calldataload(add(pubSignals, 1344)))
                
                g1_mulAccC(_pVk, IC44x, IC44y, calldataload(add(pubSignals, 1376)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            
            checkField(calldataload(add(_pubSignals, 64)))
            
            checkField(calldataload(add(_pubSignals, 96)))
            
            checkField(calldataload(add(_pubSignals, 128)))
            
            checkField(calldataload(add(_pubSignals, 160)))
            
            checkField(calldataload(add(_pubSignals, 192)))
            
            checkField(calldataload(add(_pubSignals, 224)))
            
            checkField(calldataload(add(_pubSignals, 256)))
            
            checkField(calldataload(add(_pubSignals, 288)))
            
            checkField(calldataload(add(_pubSignals, 320)))
            
            checkField(calldataload(add(_pubSignals, 352)))
            
            checkField(calldataload(add(_pubSignals, 384)))
            
            checkField(calldataload(add(_pubSignals, 416)))
            
            checkField(calldataload(add(_pubSignals, 448)))
            
            checkField(calldataload(add(_pubSignals, 480)))
            
            checkField(calldataload(add(_pubSignals, 512)))
            
            checkField(calldataload(add(_pubSignals, 544)))
            
            checkField(calldataload(add(_pubSignals, 576)))
            
            checkField(calldataload(add(_pubSignals, 608)))
            
            checkField(calldataload(add(_pubSignals, 640)))
            
            checkField(calldataload(add(_pubSignals, 672)))
            
            checkField(calldataload(add(_pubSignals, 704)))
            
            checkField(calldataload(add(_pubSignals, 736)))
            
            checkField(calldataload(add(_pubSignals, 768)))
            
            checkField(calldataload(add(_pubSignals, 800)))
            
            checkField(calldataload(add(_pubSignals, 832)))
            
            checkField(calldataload(add(_pubSignals, 864)))
            
            checkField(calldataload(add(_pubSignals, 896)))
            
            checkField(calldataload(add(_pubSignals, 928)))
            
            checkField(calldataload(add(_pubSignals, 960)))
            
            checkField(calldataload(add(_pubSignals, 992)))
            
            checkField(calldataload(add(_pubSignals, 1024)))
            
            checkField(calldataload(add(_pubSignals, 1056)))
            
            checkField(calldataload(add(_pubSignals, 1088)))
            
            checkField(calldataload(add(_pubSignals, 1120)))
            
            checkField(calldataload(add(_pubSignals, 1152)))
            
            checkField(calldataload(add(_pubSignals, 1184)))
            
            checkField(calldataload(add(_pubSignals, 1216)))
            
            checkField(calldataload(add(_pubSignals, 1248)))
            
            checkField(calldataload(add(_pubSignals, 1280)))
            
            checkField(calldataload(add(_pubSignals, 1312)))
            
            checkField(calldataload(add(_pubSignals, 1344)))
            
            checkField(calldataload(add(_pubSignals, 1376)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
