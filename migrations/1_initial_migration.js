const Gashapon = artifacts.require("Gashapon");

module.exports = function (deployer) {
  deployer.deploy(Gashapon, "Gashapon", "$OWL", 16, 32, .001 * 10 ** 18, 5);
};
