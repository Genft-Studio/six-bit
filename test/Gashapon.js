const Gashapon = artifacts.require('Gashapon')
const {utils: {solidityKeccak256}} = require("ethers")

// const accounts = await web3.eth.getAccounts()

contract('Gaspapon', async accounts => {
    it("should add DNA, name and difficulty when minting", async () => {
        const seed = new Uint8Array(Buffer.from('e6b2d7a64491e7544051cb9906851bdc2258944d8651c7fbd2b90a2eae8c6600', 'hex'))
        const expectedHash = Buffer.from('000092402e1010955f5fbdde21834684afa23a0dcaf065b704e12a581d09d748', 'hex')
        const expectedDna = Buffer.from('1d09d748', 'hex')
        const testName = "My awesome owl!"
        const tokenURI = "fake://Uri"

        const instance = await Gashapon.deployed()

        const nextId = await instance.getNumberOfToys()

        console.log('starting minting...')
        await instance.mintToy(seed, testName, tokenURI, {value: 0.01 * 10**18})

        console.log('calculated hash:', await instance.debug.call())
        console.log('finished minting...')

        assert.equal(parseInt(nextId) + 1, await instance.getNumberOfToys())

        const {0: name, 1: dna, 2: difficulty} = await instance.getToyOverview(nextId)

        assert.equal(testName, name)
        // FIXME assert.equal(expectedDna.toString('hex'), dna.toString(16, 8))
        // FIXME assert(difficulty.toNumber() >= 1, 'difficulty should be at least one')
    })
})