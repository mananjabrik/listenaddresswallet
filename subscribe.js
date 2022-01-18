const Web3 = require('web3');

class TransactionChecker {
  web3;
  web3ws;
  account;
  subscription;

  constructor(account) {
    this.web3ws = new Web3(
      new Web3.providers.WebsocketProvider(
        // 'wss://ropsten.infura.io/ws/v3/c7b7e4315ecc48d5a921d620c38f27d0'
        'wss://speedy-nodes-nyc.moralis.io/8122cb5789546bcf071c0cd5/bsc/testnet/ws'
      )
    );
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        'https://speedy-nodes-nyc.moralis.io/8122cb5789546bcf071c0cd5/bsc/testnet'
      )
      // 'https://ropsten.infura.io/v3/c7b7e4315ecc48d5a921d620c38f27d0'
    );
    this.account = account.toLowerCase();
  }

  subscribe(topic) {
    this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
      if (err) console.error(err);
    });
  }

  watchTransactions() {
    console.log('Watching all pending transactions...');
    this.subscription.on('data', (txHash) => {
      setTimeout(async () => {
        try {
          let tx = await this.web3.eth.getTransaction(txHash);
          let txReceipt = await this.web3.eth.getTransactionReceipt(txHash);
          if (tx != null || txReceipt != null) {
            if (this.account == tx?.to?.toLowerCase()) {
              //   console.log({
              //     transactionHash: tx.hash,
              //     status: txReceipt?.status,
              //     blockNumber: tx?.blockNumber,
              //     timestamp: new Date(),
              //     from: tx?.from,
              //     to: tx?.to,
              //     value: this.web3?.utils.fromWei(tx?.value, 'ether'),
              //     transactionFee: this.web3?.utils.fromWei(tx?.gasPrice, 'ether'),
              //   });
              console.log('check logs :', tx);
              console.log('check logs :', txReceipt.logs[topic[0]]);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, 60000);
    });
  }
}

let txChecker = new TransactionChecker(
  '0x927709c1403747BDd26737aE95282fFb9e987F17'
);
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();
