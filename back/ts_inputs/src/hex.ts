//transfer bigInt -> hex
export function fromBigInt(bi : bigint): string {
    const hex = bi.toString(16);
    return (hex.length % 2 != 0) ? "0" + hex : hex;
}

//transfer Uint8Array -> hex
export function fromArrayBuffer(input : Uint8Array) : string {
    let res : string[] = [];
    input.forEach(i => res.push(('0' + i.toString(16)).slice(-2)));
    return res.join('');
}

//transfer hex -> Uint8Array
export function toArrayBuffer(input : string): Uint8Array {
    if ((input.length % 2) !== 0) {
        throw new RangeError('Expected string to be an even number of characters')
    }

    const view = new Uint8Array(input.length / 2)
    for (let i = 0; i < input.length; i += 2) {
        view[i / 2] = parseInt(input.substring(i, i + 2), 16)
    }
    return view;
}
