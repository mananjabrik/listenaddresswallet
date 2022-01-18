// const TOKEN = "FGYS8UZBHGAEDF7CFBIE4HM435MTG2I9MW";

const Web3 = require('web3');
const { differenceInMinutes } = require('date-fns');
// const url = "https://eth-ropsten.alchemyapi.io/v2/ERgJ6a1AgzAqtbEmqBtXBEkryobCfwlV";

// Using web3js
const web3 = new Web3(
  //   new Web3.providers.WebsocketProvider(
  // 'wss://bsc.getblock.io/testnet/?api_key=9e3461bd-b9d0-4135-b22e-b26f59a60ae1'
  // 'wss://bsc.getblock.io/testnet/?api_key=f2e715e6-8838-4230-83d2-62c6f1ad9a44'
  // 'wss://eth.getblock.io/ropsten/?api_key=f2e715e6-8838-4230-83d2-62c6f1ad9a44'
  //   'wss://speedy-nodes-nyc.moralis.io/8122cb5789546bcf071c0cd5/bsc/testnet/ws'
  //   'wss://speedy-nodes-nyc.moralis.io/8122cb5789546bcf071c0cd5/bsc/testnet/ws'
  //   )
  'wss://ropsten.infura.io/ws/v3/c7b7e4315ecc48d5a921d620c38f27d0'
  //   'https://ropsten.infura.io/v3/c7b7e4315ecc48d5a921d620c38f27d0'
  //   'https://data-seed-prebsc-1-s1.binance.org:8545/'
);

const eth = web3.eth;

let lastCount = null;

var myAddr = '0x927709c1403747BDd26737aE95282fFb9e987F17';
const run = async () => {
  let currentBlock = await eth.getBlockNumber();

  for (let i = currentBlock; i > 0; i--) {
    console.log('checking block', i);
    const block = await eth.getBlock(i, true);
    const timestamp = block.timestamp * 1000;
    const blockTime = new Date(timestamp);
    const diff = differenceInMinutes(new Date(), blockTime);

    if (diff > 2) {
      break;
    }

    (block?.transactions ?? []).forEach(async (trans) => {
      if (myAddr == trans.from) {
        // aku ngirim ke address lain
        if (trans.from != trans.to) {
          const receipt = await web3.eth.getTransactionReceipt(trans.hash);
          console.log('aku ngirim', trans);
          console.log('receipt', receipt);
        }
      }

      if (myAddr == trans.to) {
        // aku nerimo
        if (trans.from != trans.to) {
          const receipt = await web3.eth.getTransactionReceipt(trans.hash);
          console.log('aku nerimo', trans);
          console.log('receipt', receipt);
        }
      }
    });
  }
};

setInterval(async () => {
  run();
}, 1000 * 60);

run();
