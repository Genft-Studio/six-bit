const Gashapon = artifacts.require("Gashapon");
const GashaponFactory = artifacts.require("GashaponFactory")

module.exports = async function (deployer) {
  // await deployer.deploy(Gashapon, "Gashapon", "$OWL", 16, 32, .001 * 10 ** 18, 5);
  await deployer.deploy(GashaponFactory)

    // console.log("Running createChild(...) on newly deployed GashaponFactory")
    let gashaponFactory = await GashaponFactory.deployed()
    // let child = await gashaponFactory.createChild(
    //     "Gashapon", "$OWL", 16, 32, .001 * 10 ** 18, 5,
    //     'https://bafybeiawde3rbrxyhv2yelitx2awslwbjmfkxsqmjfx44hcv56dwf77f2m.ipfs.dweb.link/'
    // );
    // console.log("Child address: ", child.logs[0].address)
};
