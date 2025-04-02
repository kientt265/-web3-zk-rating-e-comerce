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

contract Groth16VerifierNew {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 15769523445920789112902028820070029981467354057147481713228522587382421370832;
    uint256 constant alphay  = 12207266975932420666947031153096472546758559283778368961999607279297574396549;
    uint256 constant betax1  = 13256164347002407893569257291313584899181050090161069761224138749902233870529;
    uint256 constant betax2  = 20204080053621795208263468769433776084443131602406003816101283786403287674058;
    uint256 constant betay1  = 1580049664755940842574503061647809415044598423878384155382001379341298251851;
    uint256 constant betay2  = 13372713090751265483179337628089330567752392989988904450518014645900155736345;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 11919883873286932960806001317367029113417778458753563103222740895303434549939;
    uint256 constant deltax2 = 2043036770647800615845232335572072806346456094214922871446413161590216391109;
    uint256 constant deltay1 = 17645438482456591005988936054760888470312770591682653082262206471325529243817;
    uint256 constant deltay2 = 8741028555443280418242134449167513156746726861573069872423055325297012779878;

    
    uint256 constant IC0x = 16760496056402966050187800268302834863021442795025518170424703065041763021711;
    uint256 constant IC0y = 16252212448733214106897391836730951574464574511643571858080233245443291981846;
    
    uint256 constant IC1x = 4945029645384757784829384241029366807910151494752531225990935905772527996467;
    uint256 constant IC1y = 12625848038320575773754809295563608100903948958385963114192843167761073973472;
    
    uint256 constant IC2x = 12141695282767798583750716871547506818548397307078057903544421639545051570194;
    uint256 constant IC2y = 18922189982202858121766073664867345940755537175219934267200465654010752159582;
    
    uint256 constant IC3x = 10882737221996809528326011848586374429945479651589174295506167609371251150999;
    uint256 constant IC3y = 2296239233770518590597867634855679891579669687441146776434461513846060693813;
    
    uint256 constant IC4x = 913592762659375466415579376113273381010661740880202936822359947088527508007;
    uint256 constant IC4y = 17851303493646081301903866166924111794632734254361838999584275530903011834475;
    
    uint256 constant IC5x = 4303244853315076462904994028996210575477155456928286393471112752338167951186;
    uint256 constant IC5y = 20684855849318012205342152730359199918777143454521947686821000742999030833654;
    
    uint256 constant IC6x = 11858552897921863117893812690565526642021006390151168215651062705162357919898;
    uint256 constant IC6y = 15129810954484251246679698100424815111955121382494041001089183313465454134529;
    
    uint256 constant IC7x = 19356722320999830195115396176315359505289204003255058601988443819959823936571;
    uint256 constant IC7y = 19967786343255714339344934633472953170595285837456017313836743369790897132707;
    
    uint256 constant IC8x = 14064712784306390841737027163634905259943498533289618044447137033639769558238;
    uint256 constant IC8y = 8178151585090897662593546165409944624049172519730931175479792064378139585807;
    
    uint256 constant IC9x = 3817340434429388838770609739784284278042572446499697970692197142151561371518;
    uint256 constant IC9y = 10307942349315415743122337709924894235959107638186458488708881827196924978129;
    
    uint256 constant IC10x = 13383932961348404456426755374347912945650396359957250971697434739329007455447;
    uint256 constant IC10y = 1394786888926941212603493196132952460815684242203377529110348988326703799084;
    
    uint256 constant IC11x = 8560454689523400001768569275701427661975813144622871339958238131148096525610;
    uint256 constant IC11y = 4000495156729350370226302677681731367271081455213316261530342824166576390636;
    
    uint256 constant IC12x = 8331724052005965567201165918011249372751994821549049489111566361302836689418;
    uint256 constant IC12y = 2691086974565393421646895922187463980333743679058247833147700605971035457164;
    
    uint256 constant IC13x = 13310090328514462152429713425750479190219824292570998334569659759755037639573;
    uint256 constant IC13y = 14779734784230637147145052892710369599193804917806152155496802887849795490009;
    
    uint256 constant IC14x = 13649654323747888649597654675650306248745981614203054109042070673413163757754;
    uint256 constant IC14y = 2696161473790448306399927063830226505175943128550525832911704373201209966613;
    
    uint256 constant IC15x = 12534266675544224537374985916405837396806477909202150891062049546677216054422;
    uint256 constant IC15y = 20754563552142661681624537126136558344849998913634154670266394263882689982475;
    
    uint256 constant IC16x = 16544812366885454105218963535118935483198398877116175658261681070765551779645;
    uint256 constant IC16y = 6197027283477689750753583029642618843400932991338860350987196074729557532838;
    
    uint256 constant IC17x = 6270977875536138046326946485581451341955744463762593362408651473146109578905;
    uint256 constant IC17y = 18984735905933866227953592250609461636204887058742640118551560327035991743055;
    
    uint256 constant IC18x = 14612477092380646015541424219077215693408048989459486970515816621493099844468;
    uint256 constant IC18y = 12465888722686046766396123870877067884394062417137696960904259994782993733343;
    
    uint256 constant IC19x = 5411930797165723526254927375393898135661910215945475722657053878041891214745;
    uint256 constant IC19y = 20993631906032776334137624082116334867581861836283331867169066621317461670076;
    
    uint256 constant IC20x = 1019392845664735107511871559602223912449366553553710313853204546887457585276;
    uint256 constant IC20y = 3107151780494002735479204474856274556995183842787226036089532230377551601609;
    
    uint256 constant IC21x = 7319966226456424623368921867128418991171428499034542339314692369304087149216;
    uint256 constant IC21y = 7752100200372368886253762372249226551024510121314964446184932606498331964990;
    
    uint256 constant IC22x = 20961980990836515896497583547841351696937999670504683475684577950224458603001;
    uint256 constant IC22y = 108948976328388327511315434376095299357669371395612898855141211601850816166;
    
    uint256 constant IC23x = 10346267234374670722048670026337012110953010249217849378949662069358566154219;
    uint256 constant IC23y = 8753528306343358619555113969684363338853812711187402574554965478204399174015;
    
    uint256 constant IC24x = 6248027544772664133461051986956706173880858619397479933437338475749467912808;
    uint256 constant IC24y = 5831997080104553253948738275069147661882603696194555607516591292890463360625;
    
    uint256 constant IC25x = 3521946647790576736832532822445972742626376751656698838299881287473044487456;
    uint256 constant IC25y = 13144546804611341293249496552631210627167756964171030950391257371689896808544;
    
    uint256 constant IC26x = 20768400122272861393560350573412087696388280381566125174563639835541781541895;
    uint256 constant IC26y = 7746242579636083302229920421614444819160002783945969004099962580127216837603;
    
    uint256 constant IC27x = 6012766526430871206969011630770399166875008288442378320024646616501767626992;
    uint256 constant IC27y = 11197912385388634151318483736425026673465021863240293830782567037005019833012;
    
    uint256 constant IC28x = 4664385222836818274380912607600864415131591079617518749068931325411350822540;
    uint256 constant IC28y = 3190488914253575197894236996188345916319135295471533372004747886420681568442;
    
    uint256 constant IC29x = 9988759211312560222640813213493761990074387042787678472200219063440678159099;
    uint256 constant IC29y = 6835163431341154420923427436695538267799650649612478214230826052756005544505;
    
    uint256 constant IC30x = 19842984750733442606708526480020482935202727483404584415251221738855922296361;
    uint256 constant IC30y = 11873707753433830270471939741469066632431272546121496240587052686555180133725;
    
    uint256 constant IC31x = 19630585465400113205874764779044852689215042664632751451615771137929964380965;
    uint256 constant IC31y = 4199264448532809334479147896143405529496240012493377508984868004255741762941;
    
    uint256 constant IC32x = 3243902237273100511387829487592612222360849262224305559070808480588466890670;
    uint256 constant IC32y = 3044448376862568634702153618342480798044997379040031420550396003698545520938;
    
    uint256 constant IC33x = 17073527888917425659666611007611006513013830458885953013159449085589695626856;
    uint256 constant IC33y = 10635404934712238443747220669677381886854437403644406694711630169735903933598;
    
    uint256 constant IC34x = 11931640531206622044837825959726446812065322495959519902688464308694907473204;
    uint256 constant IC34y = 1745873247159732574439438472072955121756894500920738632507532290129287001349;
    
    uint256 constant IC35x = 871930934952245519892362216363710593358072096355983333718413061379484638944;
    uint256 constant IC35y = 20803481754077710841960415715255726222278510129720661563737725273383954938725;
    
    uint256 constant IC36x = 3764198457319497889017145007489879032431462280789287362559137942852966960890;
    uint256 constant IC36y = 17842676415663838115421708233296860376342406563269170252952403313331033118555;
    
    uint256 constant IC37x = 5521102117803061610970853612731205931331456322365317788652067243157226822426;
    uint256 constant IC37y = 3083505387626971736304447458859609332288532517946472635090798577391345952454;
    
    uint256 constant IC38x = 9447410578990691860509523048051402166665643356997139041461851518841900567961;
    uint256 constant IC38y = 1805507777168160233188208237135770398598598078054834260551784376360286775292;
    
    uint256 constant IC39x = 11402035887734778073787668101264828395866251140530877825482193853975198955894;
    uint256 constant IC39y = 603366868505246611464986849032980790086639539960270804406357211228892168647;
    
    uint256 constant IC40x = 1575158290279387846975202901484255896655430785443003850930831050175249204709;
    uint256 constant IC40y = 10446026604418793760085505574170058998313510498610930982160600095354979145059;
    
    uint256 constant IC41x = 15444004869645504641277544019569010703454538157658894761947145284727120199156;
    uint256 constant IC41y = 12191109503181194458211132947482867883032159800567557011553277459223258601022;
    
    uint256 constant IC42x = 11697516722410810870537361186939752784288304274311281808080368782846770711956;
    uint256 constant IC42y = 20804002275827405943031672022851028604373048861688150472467087988659726599600;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[42] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
