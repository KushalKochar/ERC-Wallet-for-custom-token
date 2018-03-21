var KusCoin = artifacts.require("./KusCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(KusCoin);
};
