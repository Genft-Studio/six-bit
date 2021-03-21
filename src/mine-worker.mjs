import Ethers from "ethers"
import pkg from 'bitwise-buffer';
const { xor, and: bitwiseAnd, or, nor, not, lshift, rshift } = pkg;

function randomBuffer(){
    var x = new Uint8Array(32);
    for(var i = 0; i < 32; i++){
        x[i] = Math.floor(Math.random() * 256);
    }
    return Buffer.from(x);
}

function isZero(b) {
    let i = b.length
    let result = 0;

    while (i--) {
        result |= b[i];
    }
    return !result
}

export default function mine(salt, difficultyBits, dnaBits, address) {
    const difficultyMask = Buffer.from(new Uint8Array(32))
    rshift.mut(difficultyMask, difficultyBits, 1)

    const dnaMask = Buffer.from(new Uint8Array(32))
    lshift.mut(dnaMask, dnaBits, 1)

    let guess, hash;
    var time = Date.now();
    var count = 0;
    var startTime = Date.now();
    while (true){
        guess = randomBuffer();

        const hashHex = Ethers.utils.solidityKeccak256(
            ['address', 'string', 'uint256'],
            [address, salt, guess]
        )
        hash = Buffer.from(hashHex.slice(2), 'hex')
        if (isZero(bitwiseAnd(hash, difficultyMask))) {
            break
        }
    }
    var rawTime = (Date.now() - startTime)/1000
    var time = Math.floor(rawTime);
    var khs = Math.round(count/rawTime/1000);
    var dna = bitwiseAnd(hash, dnaMask).slice(-Math.ceil(dnaBits / 8))
    return {seed: guess, dna, time, hash, khs};
}

const onmessage = function(salt, difficultyBits, dnaBits, address){
    var result = mine(salt, difficultyBits, dnaBits, address);
    postMessage(result);
}

// const testAddress = '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'
// let result = mine('$OWL', 16, 32, testAddress)
// console.log('seed:', result.seed.toString('hex'))
// console.log('hash:', result.hash.toString('hex'))
// console.log('dna:', result.dna.toString('hex'))
// console.log('address:', '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'.slice(2))
// console.log('difficulty bits:', 16)
// console.log('dna bits:', 32)
// console.log('salt: $OWL')


// seed: e6b2d7a64491e7544051cb9906851bdc2258944d8651c7fbd2b90a2eae8c6600
// hash: 000092402e1010955f5fbdde21834684afa23a0dcaf065b704e12a581d09d748
// dna: 1d09d748
// address: 534Eb19E729E955308e5A9c37c90d4128e0F450F
// difficulty bits: 16
// dna bits: 32
// salt: $OWL
