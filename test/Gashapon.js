const Gaspapon = artifacts.require('Gashapon')

// const accounts = await web3.eth.getAccounts()

contract('Gaspapon', async accounts => {
    it("should mint an unproven toy", async () => {
        const instance = await Gaspapon.deployed()

        const nextId = await instance.getNumberOfToys()
        const id = await instance.mintToy("0xDEAD")
        assert.equal(parseInt(nextId) + 1, await instance.getNumberOfToys())

        const {0: name, 1: dna, 2: difficulty} = await instance.getToyOverview(nextId)
        assert.equal('<unproven>', name)
        assert.equal(0, dna)
        assert.equal(0, difficulty)

    })

    it("should add DNA, name and difficulty", async () => {
        const instance = await Gaspapon.deployed()

        const nextId = await instance.getNumberOfToys()
        const id = await instance.mintToy("0xDEAD")
        assert.equal(parseInt(nextId) + 1, await instance.getNumberOfToys())

        const {0: name, 1: dna, 2: difficulty} = await instance.getToyOverview(nextId)
        assert.equal('<unproven>', name)
        assert.equal(0, dna)
        assert.equal(0, difficulty)

    })
})