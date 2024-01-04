# Update EIP4844 Blobs
eip-4844 blobs upload tool.

## Installation

With [npm](https://npmjs.org) do

```bash
$ npm install @ethstorage/blob-uploader
```


### Supports 3 types of transactions
```js
const TYPE_NORMAL         = "1"; // Upload blobs to any addresses
const TYPE_STORAGE        = "2"; // Upload blobs to EthStorage
const TYPE_FLAT_DIRECTORY = "3"; // Upload blobs to FlatDirectory
```


###  Normal
Upload blobs to any addresses
```
npx blob-uploader --type 1 --rpc <rpc> --privateKey <private-key> --to <to address>  --file <file path>

// If you are calling a contract function, you need to bring calldata
npx blob-uploader --type 1 --rpc <rpc> --privateKey <private-key> --to <to address>  --file <file path> --data <contract calldata>

// output: send hash 
```
##### Example
```
npx blob-uploader --rpc http://65.109.115.36:8545/ --privateKey 0xa... --to 0x13b... --file /User/a/b.jpg
npx blob-uploader --type 1 --rpc http://65.109.115.36:8545/ --privateKey 0xa... --to 0x13b... --file /User/a/b.jpg
npx blob-uploader --type 1 --rpc http://65.109.115.36:8545/ --privateKey 0xa... --to 0x13b... --file /User/a/b.jpg --data 0xabc...
```
<br/>


###  EthStorage
Upload blobs to EthStorage
```
npx blob-uploader --type 2 --rpc <rpc> --privateKey <private-key> --file <file path>

// output: send hash 
```
##### Example
```
npx blob-uploader --type 2 --rpc http://65.109.115.36:8545/ --privateKey 0xa... --file /User/a/b.jpg
```
<br/>

###  FlatDirectory
Upload blobs to the file management contract FlatDirectory
```
npx blob-uploader --type 3 --rpc <rpc> --privateKey <private-key> --file <file path>

// If the flat directory contract has been deployed, you can specify it through --to
npx blob-uploader --type 3 --rpc <rpc> --privateKey <private-key> --file <file path> --to <flat directory address>

// output: send hash 
```
##### Example
```
npx blob-uploader --type 3 --rpc http://65.109.115.36:8545/ --privateKey 0xa... --file /User/a/b.jpg
npx blob-uploader --type 3 --rpc http://65.109.115.36:8545/ --privateKey 0xa... --file /User/a/b.jpg --to 0x123...
```
<br/>
