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
    uint256 constant alphax  = 11852084094086271027903105423616066572011785713453588699585122069493033733097;
    uint256 constant alphay  = 3753258329343610163110251720724176703730888465420545577472594273251085202268;
    uint256 constant betax1  = 12322671125236906258932157524897899614978127383485179576846828298655128047965;
    uint256 constant betax2  = 4038873926473076536591420446942798872568958254617658580103050461903625067887;
    uint256 constant betay1  = 12335881047358655380738430239364874608930277335755407057912077203376288821858;
    uint256 constant betay2  = 6131399306817431691413029953642097250152992237601637146068029754194546684871;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 12820493420106428095232099101803651105895575335909482340870555896070398134596;
    uint256 constant deltax2 = 2899210569382048778114345674936614498073682538965692580085656018243178471398;
    uint256 constant deltay1 = 12265489603465072158452280456076301489725710095702083760206401963790478213230;
    uint256 constant deltay2 = 12188945626524543090861062381381197835090287976854310292346982400515519906372;

    
    uint256 constant IC0x = 4099935573011174429889585149378865907518406160729489519287652105537114837194;
    uint256 constant IC0y = 18288628560053874482636220867315079255901054640958902175536544595055300157831;
    
    uint256 constant IC1x = 18535074395051504657182183819004363974683760789084345309480937084822701687513;
    uint256 constant IC1y = 2999331200014173936782188533625137518701763656203740194622347776113634305231;
    
    uint256 constant IC2x = 19902664816861586425333566532501828829403614540206457805390918812109137941679;
    uint256 constant IC2y = 1027128865246893045809927211633626646338128150066628897859124212790488493875;
    
    uint256 constant IC3x = 12210176845063567223134790908898123074063476834383982779892847361290493907260;
    uint256 constant IC3y = 11974941293542833962327073268441403395594341871368578986689523324467332034507;
    
    uint256 constant IC4x = 18336904599374485064488415496016448022940425350465999490663882460626294395112;
    uint256 constant IC4y = 871472380494988740425405456610118074202748076685939695981022699194036308374;
    
    uint256 constant IC5x = 3321473569504759888586808357856902142166371045324829541627488130804376571972;
    uint256 constant IC5y = 5065407636957807809262313482228479670513486297167156970261492281935001897857;
    
    uint256 constant IC6x = 15564891542963471618777682207174463473117944596855506703330802632386647909320;
    uint256 constant IC6y = 20832421869920838773381833949633323280501827514347822213950244752603934657823;
    
    uint256 constant IC7x = 21615327728536533518865911449935598171530775380543611483501738013849265898057;
    uint256 constant IC7y = 16043069673140257964449107213344251137987719364977299070470005333588925090392;
    
    uint256 constant IC8x = 5593440970210879653967669844792894554031456846884957945672459473225989252124;
    uint256 constant IC8y = 3284003353989967048004281743779817460438001459345492566569651959116744210427;
    
    uint256 constant IC9x = 19240612217090716133192205801919629522280368037259530947568697709447829504854;
    uint256 constant IC9y = 17813792794998164499101696881579655856659748501582440879837968025857760396324;
    
    uint256 constant IC10x = 14868148253491751696843287592330823606943664217294059755313466016537605625481;
    uint256 constant IC10y = 21698411556450069762565538619350000173915902388236320994678738495930237295947;
    
    uint256 constant IC11x = 15255559905342603133527589500200307471653293964409913244861231173456409958011;
    uint256 constant IC11y = 7945486831976492724298340626500167710480007491607584474570897155973893717640;
    
    uint256 constant IC12x = 13350546915835602771221757368633899193260815069656853405508648844537457375814;
    uint256 constant IC12y = 20828172233674019842228470245079371806021357093487407548528768666244345680999;
    
    uint256 constant IC13x = 13962240592887967963473189287874584440305012183347386747814172341934606456825;
    uint256 constant IC13y = 8517983532611557869847268753584027249261895437683561398629196750272483051777;
    
    uint256 constant IC14x = 11928415391963600852725456893845650038133403827292048834745302280065896363013;
    uint256 constant IC14y = 21126952003455420323176409272446433803833928369876513691291858637484674844532;
    
    uint256 constant IC15x = 3750366398239809803203024037419944736076744757894058731816097234777534939111;
    uint256 constant IC15y = 13303033183619894954061406119428279743694040258683050598168513370730682013853;
    
    uint256 constant IC16x = 1279450126612051886334663694478896415377963812920646821236805722324488985575;
    uint256 constant IC16y = 12828144354597661825918087722015135045339223724245412664248761168570001803727;
    
    uint256 constant IC17x = 1687104550687776854922975780699936990900606551618578915720006256278784994329;
    uint256 constant IC17y = 14756487232909361361412994037647023085965316157122901588008612897794539436738;
    
    uint256 constant IC18x = 9744928698843467256378473186586797518981414127897855325208597128280840436869;
    uint256 constant IC18y = 3128892239021739939864518941218915337423538821095475881096330691146249829652;
    
    uint256 constant IC19x = 17115128990782641521818260886404905653321416995323411597241464599375175370946;
    uint256 constant IC19y = 8274424636332970590709684073000906034220232234794619328542834224055886785494;
    
    uint256 constant IC20x = 18629800529152154585827554426490804816709205605976240588426356305090593644677;
    uint256 constant IC20y = 7698742008807442011966053860003315699428075577652075016044497318213955626964;
    
    uint256 constant IC21x = 497718958140255928741018975662261472659819568688611408135476041215728004307;
    uint256 constant IC21y = 2859945036236313145521852098419839710340069948771507786717903705317322764298;
    
    uint256 constant IC22x = 18144309797088200933993155558024038767268403202505614734114855961482812902285;
    uint256 constant IC22y = 15689097505948613408078800715557352006141434496138477017732236127172853298818;
    
    uint256 constant IC23x = 20768187088141445518011033358852881522576545801345122768394293246720524082658;
    uint256 constant IC23y = 14751912201396336922503686872200485402436293057925844756923474103293710776310;
    
    uint256 constant IC24x = 1189388759734876558809435474298777585711678390240516675617951137413317721757;
    uint256 constant IC24y = 3254685213066476183827433481809547955085002243302633849998630141093283984393;
    
    uint256 constant IC25x = 892667265561864654458437724744602755245125455835577730116426388459665894810;
    uint256 constant IC25y = 20830090865045313054360451873649642808515222331176620351193309793851537268242;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[25] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
