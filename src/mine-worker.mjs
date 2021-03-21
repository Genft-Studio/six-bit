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

export default function mine(salt, difficultyBits, dnaBits) {
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

        const hashHex = Ethers.utils.solidityKeccak256(['string', 'uint256'], [salt, guess])
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

const onmessage = function(salt, difficultyBits, dnaBits){
    var result = mine(salt, difficultyBits, dnaBits);
    postMessage(result);
}

// let result = mine('$OWL', 16, 32)
// console.log(result)


// Test output
// Diffculty: 16
// Dna: 32
// Salt: "$OWL"
// Seed: 8a0e365a30cf850dd92f5e82c017b420bdcc9569ba4e12f3bde23567ba5077a1
// Hash: 0000551268ed3bd170f482396cbd06f9b5122517d7812c8d2561a80106da6873
// DNA: 06da6873