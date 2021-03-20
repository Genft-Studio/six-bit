const Gashapon = artifacts.require("Gashapon");

module.exports = function (deployer) {
  deployer.deploy(Gashapon, "Gashapon", "$TOY", "0xEEEE");
};
