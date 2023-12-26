# Send EIP4844 Tx
eip-4844 blobs upload tool.

## Installation

With [npm](https://npmjs.org) do

```bash
$ npm install 4844-blob-uploader
```


### Create And Send Tx
```js
const contractAddress = '0x038dB...E8F38F82'
const contractABI = [
    'function writeChunk(bytes memory name) public payable'
]
const provider = new ethers.providers.JsonRpcProvider('https://rpc.dencun-devnet-12.ethpandaops.io/');
const contract = new Contract(contractAddress, contractABI, provider);

// create tx
const tx = await contract.populateTransaction.writeChunk(hexName, {
    value: 10
});

...

// read file and decode blobs
const content = fs.readFileSync(filePath);
const blobs = EncodeBlobs(content);

...

// send blob
const send4844Tx = new Send4844Tx('https://rpc.dencun-devnet-12.ethpandaops.io/', "private key");
const hash = await send4844Tx.sendTx(tx, blobs);
console.log(hash);
const txReceipt = await send4844Tx.getTxReceipt(hash);
console.log(txReceipt);
```
