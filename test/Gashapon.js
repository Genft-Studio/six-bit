const Gashapon = artifacts.require('Gashapon')
const {utils: {solidityKeccak256}} = require("ethers")

// const accounts = await web3.eth.getAccounts()

contract('Gaspapon', async accounts => {
    it("should mint an unproven toy", async () => {
        const instance = await Gashapon.deployed()

        const nextId = await instance.getNumberOfToys()
        await instance.mintToy("0xDEAD")
        assert.equal(parseInt(nextId) + 1, await instance.getNumberOfToys())

        const {0: name, 1: dna, 2: difficulty} = await instance.getToyOverview(nextId)
        assert.equal('<unproven>', name)
        assert.equal(0, dna)
        assert.equal(0, difficulty)

    })

    it("should add DNA, name and difficulty when  proof is revealed", async () => {
        const seed = new Uint8Array(Buffer.from('8a0e365a30cf850dd92f5e82c017b420bdcc9569ba4e12f3bde23567ba5077a1', 'hex'))
        const expectedHash = Buffer.from('0000551268ed3bd170f482396cbd06f9b5122517d7812c8d2561a80106da6873', 'hex')
        const expectedDna = Buffer.from('06da6873', 'hex')
        const testName = "My awesome owl!"
        const tokenURI = "fake://Uri"

        const instance = await Gashapon.deployed()

        const nextId = await instance.getNumberOfToys()

        const digest = solidityKeccak256(['uint256', 'uint256'], [accounts[0], seed])
        await instance.mintToy(digest)

        assert.equal(parseInt(nextId) + 1, await instance.getNumberOfToys())

        const work = solidityKeccak256(['string', 'uint256'], ['$OWL', seed])
        await instance.revealRarityProof(nextId, seed, expectedDna, testName, tokenURI)

        const {0: name, 1: dna, 2: difficulty} = await instance.getToyOverview(nextId)

        assert.equal(testName, name)
        assert.equal(expectedDna.toString('hex'), dna.toString(16, 8))
        // FIXME
        // assert(difficulty.toNumber() >= 1, 'difficulty should be at least one')
    })
})