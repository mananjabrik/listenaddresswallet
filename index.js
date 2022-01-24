
import Web3 from 'web3';
import abi from "./petmoon.js";
const address = '0x18c0748d93ffdf7e7fcf9b9c9e858f80a5a5c770';

// ---------------- Initialize web3, set provider and set contract
var web3 = new Web3(
  new Web3(
    "wss://speedy-nodes-nyc.moralis.io/b0d598114a58a033a0ae9fb3/bsc/testnet/ws"
  )
);
const myContract = new web3.eth.Contract(abi, address)

async function pake_getPastEvent() {
  const curentblock = await web3.eth.getBlockNumber();  
  const startblock = curentblock - 50;

  let options = {
    fromBlock: startblock,
    toBlock: 'latest',
  };

  const events = await myContract.getPastEvents("Transfer", options);

  for (var i = 0; i < events.length; i++) {
    let a = JSON.stringify(events[i].returnValues);
    console.log(events[i]);
  }
}

function pake_MyEvent(){
  myContract.events.Transfer().
  on('data', (event) => {
    const data = JSON.parse(JSON.stringify(event));
    // console.log(`event : ${JSON.stringify(event)}`);
    console.log(`ADDRESS : ${event.address}`);
    console.log(`DARI : ${event.returnValues.from}`);
    console.log(`KE : ${event.returnValues.to}`);
    console.log(`VALUE : ${event.returnValues.value}`);

  }).on('error', (error, receipt) => {
    console.log(`error : ${error} `)
  })
  .on("changed", (p) => {
    console.log(p);
  })
}

pake_MyEvent();

// setInterval(() => {
//   pake_getPastEvent();
// }, 30 * 1000)
