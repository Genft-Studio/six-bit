const Gashapon = artifacts.require("Gashapon");

module.exports = function (deployer) {
  deployer.deploy(Gashapon, "0xEEEE");
};
