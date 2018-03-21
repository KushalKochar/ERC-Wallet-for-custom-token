const HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = "This is your own mnemonic that you should never share";
var infuraURL = "https://ropsten.infura.io/HaveYourOwnURL";

module.exports = {
    networks: {
         development: {
              host: "127.0.0.1",
              port: 7545,
              network_id: "5777" // Match any network id
            },
            ropsten: {
              provider: new HDWalletProvider(mnemonic, infuraURL,0),
              network_id: 3,
              gas: 4000000
            }
       }
};
