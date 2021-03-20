import {Keccak} from "sha3"
import pkg from 'bitwise-buffer';
const { xor, and: bitwiseAnd, or, nor, not, lshift, rshift } = pkg;

function randomBuffer(){
    var x = new Array(32);
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
        let h = new Keccak(256);
        h.update(salt)
        h.update(guess)
        hash = h.digest()
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

let result = mine('Alfred the Owl', 16, 25)
console.log(result)