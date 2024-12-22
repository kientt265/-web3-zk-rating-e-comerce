import { toArrayBuffer, fromArrayBuffer, fromBigInt } from "./hex.js";
import { sha256 } from '@ethersproject/sha2';
import { Buffer } from 'buffer';

//delete prefix 0x
function strip0x(value: string): string {
    return value.startsWith('0x') ? value.substring(2) : value;
}

//transfer hex -> bigInt : Để đổi address từ hex sang BigInt (Lúc thêm không thêm 0x ở đầu)
export function toBigInt(str: string): bigint {
    const strBuff = toArrayBuffer(str); //hex -> Uint8Array
    //target | (little-endian -> big-endian)
    const hexArbo = fromArrayBuffer(strBuff.reverse());  //Uint8Array -> hex 
    return BigInt("0x" + hexArbo); //hex -> bigInt | Thêm 0x để js nhận biết được nó là chuỗi hex
}

//transfer bigInt -> hex : Để đổi address từ BigInt sang hex (Lúc thêm không thêm 0x ở đầu)
export function toString(n: bigint): string {
    const nStr = fromBigInt(n); //bigInt -> hex
    const nBuff = toArrayBuffer(nStr); //hex -> Uint8Array
    //target | (little-endian -> big-endian): Đảo ngược thứ tự của mảng Uint8Array
    return fromArrayBuffer(nBuff.reverse()); //Uint8Array -> hex
}

export async function toHash(input: string): Promise<string[]> {
    const inputBuff = toArrayBuffer(input);
    const inputHash = sha256(inputBuff);
    const inputHashBuff = new Uint8Array(Buffer.from(strip0x(inputHash), 'hex'));

    const splitArboInput = [
        fromArrayBuffer(inputHashBuff.subarray(0, 16).reverse()),
        fromArrayBuffer(inputHashBuff.subarray(16, 32).reverse()),
    ];

    return [BigInt('0x' + splitArboInput[0]).toString(), BigInt('0x' + splitArboInput[1]).toString()];
}