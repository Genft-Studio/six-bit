const Gashapon = artifacts.require('Gashapon')
const GashaponFactory = artifacts.require('GashaponFactory')

const {utils: {solidityKeccak256}, BigNumber} = require("ethers")

contract('Gashapon', async accounts => {
    it("should add DNA, name and difficulty when minting", async () => {
        const factory = await GashaponFactory.deployed()

        const seed = new Uint8Array(Buffer.from('e6b2d7a64491e7544051cb9906851bdc2258944d8651c7fbd2b90a2eae8c6600', 'hex'))
        const expectedHash = Buffer.from('000092402e1010955f5fbdde21834684afa23a0dcaf065b704e12a581d09d748', 'hex')
        const expectedDna = Buffer.from( '000000000000000000000000000000000000000000000000000000001d09d748', 'hex')
        const testName = "My awesome owl!"
        const tokenURI = "fake://Uri"

        const child = await factory.createChild("Gashapon", "$OWL", 16, 32, .001 * 10 ** 18, 5,
            'https://bafybeiawde3rbrxyhv2yelitx2awslwbjmfkxsqmjfx44hcv56dwf77f2m.ipfs.dweb.link/')

        console.log('Gashapon instance address:', child.logs[0].args._address)
        const instance = await Gashapon.at(child.logs[0].args._address)

        const nextId = await instance.totalSupply()

        const paymentAmount = BigNumber.from(10).pow(18).div(100)
        await instance.mint(seed, testName, tokenURI, {value: paymentAmount})

        assert.equal(parseInt(nextId) + 1, await instance.totalSupply())

        const nextPrice = await instance.nextPrice.call();
        const expectedNewPaymentAmount = paymentAmount.mul(105).div(100);
        // FIXME assert(expectedNewPaymentAmount.eq(nextPrice))

        const {0: name, 1: dna, 2: difficulty} = await instance.getTokenOverview(nextId)

        assert.equal(testName, name)
        assert.equal(expectedDna.toString('hex'), dna.toString(16, 8).slice(2))
        assert(difficulty.toNumber() >= 1, 'difficulty should be at least one')
    })
})