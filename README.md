# Send EIP4844 Tx
Eip4844 upload util.

## Installation

With [npm](https://npmjs.org) do

```bash
$ npm install send-4844-tx
```


### Create And Send Tx
```js
const contractAddress = '0x038dBAD58bdD56A2607D5CDf9a360D21E8F38F82'
const contractABI = [
    'function writeChunk(bytes memory name, uint256[] memory chunkIds, uint256[] memory sizes) public payable'
]
const provider = new ethers.providers.JsonRpcProvider('https://rpc.dencun-devnet-8.ethpandaops.io/');
const contract = new Contract(contractAddress, contractABI, provider);

// read file and decode blobs
const content = fs.readFileSync(filePath);
const blobs = EncodeBlobs(content);

// send blob
const send4844Tx = new Send4844Tx('https://rpc.dencun-devnet-8.ethpandaops.io/', private key );
const blobLength = blobs.length;
for (let i = 0; i < blobLength; i += 2) {
    // only 1~2 blob
    let blobArr = [];
    let indexArr = [];
    let lenArr = [];
    // blobArr = [blobs[i], blobs[i + 1]];
    
    ...

    // create tx
    const tx = await contract.populateTransaction.writeChunk(hexName, indexArr, lenArr, {
        value: 10
    });
    // send
    const hash = await send4844Tx.sendTx(blobArr, tx);
    console.log(hash);
    const txReceipt = await send4844Tx.getTxReceipt(hash);
    console.log(txReceipt);
}
```
