# Upload EIP4844 Blobs
eip-4844 blobs upload tool.

## Installation

With [npm](https://npmjs.org) do

Globally:
```bash
npm install -g eth-blob-uploader

eth-blob-uploader -r <rpc> -p <private-key> -f <file-path> -t <to-address>
```

Locally:
```bash
npm install eth-blob-uploader

npx eth-blob-uploader -r <rpc> -p <private-key> -f <file-path> -t <to-address>
```


##  Parameters
Required

| Short Name | Full Name    | description      |   
|------------|--------------|------------------|
| -r         | --rpc        | provider url     |
| -p         | --privateKey | private key      |
| -f         | --file       | upload file path |
| -t         | --to         | to address       |


Optional

| Short Name | Full Name   | description                                                                                                                         |   
|------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------|
| -d         | --data      | Calldata for contract calls                                                                                                         |
| -v         | --value     | The amount of ETH that will be sent per transaction. If a file has multiple transactions, the total ETH amount is "value * txCount" |
| -c         | --count     | The number of blobs attached to the transaction                                                                                     |
| -n         | --nonce     | Transaction nonce                                                                                                                   |
| -g         | --gasPrice  | Transaction gas price                                                                                                               |
| -b         | --blobPrice | Blob gas price                                                                                                                      |


## Command
```
eth-blob-uploader -r <rpc> -p <private-key> -f <file-path> -t <to-address>

// If you are calling a contract function, you need to bring calldata
eth-blob-uploader -r <rpc> -p <private-key> -f <file-path> -t <to-address> -d [calldata]

// You can set the eth that will be sent with each transaction via -v
eth-blob-uploader -r <rpc> -p <private-key> -f <file-path> -t <to-address> -v [value]

// You can specify the number of blobs uploaded in one transaction
eth-blob-uploader -r <rpc> -p <private-key> -f <file-path> -t <to-address> -c [count]

// output: send hash 
```
Note: A file may contain n blobs and there will be n/3 transactions, so -v should not be the total ETH, but the number of each transaction.

## Example
```
eth-blob-uploader -r http://65.109.115.36:8545/ -p 0xa...a -f /User/a/b.jpg -t 0x13b...
eth-blob-uploader -r http://65.109.115.36:8545/ -p 0xa...a -f /User/a/b.jpg -t 0x13b... -d 0xabc...00ac
eth-blob-uploader -r http://65.109.115.36:8545/ -p 0xa...a -f /User/a/b.jpg -t 0x13b... -v 8912830000
eth-blob-uploader -r http://65.109.115.36:8545/ -p 0xa...a -f /User/a/b.jpg -t 0x13b... -c 6
```
<br/>

