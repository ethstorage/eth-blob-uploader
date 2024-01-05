# Upload EIP4844 Blobs
eip-4844 blobs upload tool.

## Installation

With [npm](https://npmjs.org) do

```bash
$ npm install eth-blob-uploader
```

##  Parameters
```
Required
--rpc         Network rpc
--privateKey  Wallet private key
--file        File path
--to          Address to send to

Optional
--data        Calldata for contract calls
--count       Number of blobs uploaded per time
```

## Command
```
npx blob-uploader --rpc <rpc> --privateKey <private-key> --file <file path> --to <to address>

// If you are calling a contract function, you need to bring calldata
npx blob-uploader --rpc <rpc> --privateKey <private-key> --file <file path> --to <to address> --data <contract calldata>

npx blob-uploader --rpc <rpc> --privateKey <private-key> --file <file path> --to <to address> --data <contract calldata> --count <number of blobs>

// output: send hash 
```

## Example
```
npx blob-uploader --rpc http://65.109.115.36:8545/ --privateKey 0xa... --file /User/a/b.jpg --to 0x13b...
npx blob-uploader --rpc http://65.109.115.36:8545/ --privateKey 0xa... --file /User/a/b.jpg --to 0x13b... --data 0xabc...
npx blob-uploader --rpc http://65.109.115.36:8545/ --privateKey 0xa... --file /User/a/b.jpg --to 0x13b... --count 3
```
<br/>

