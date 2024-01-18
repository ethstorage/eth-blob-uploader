# Upload EIP4844 Blobs
eip-4844 blobs upload tool.

## Installation

With [npm](https://npmjs.org) do

Globally:
```bash
npm install -g eth-blob-uploader
eth-blob-uploader <rpc> <private-key> <file-path> <to-address> -d [calldata] -c [blob-counts]
```

Locally:
```bash
npm install eth-blob-uploader
npx eth-blob-uploader <rpc> <private-key> <file-path> <to-address> -d [calldata] -c [blob-counts]
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

| Short Name | Full Name | description                                     |   
|------------|-----------|-------------------------------------------------|
| -d         | --data    | Calldata for contract calls                     |
| -c         | --count   | The number of blobs attached to the transaction |


## Command
```
eth-blob-uploader --rpc <rpc> --privateKey <private-key> --file <file-path> --to <to-address>

// If you are calling a contract function, you need to bring calldata
eth-blob-uploader --rpc <rpc> --privateKey <private-key> --file <file-path> --to <to-address> --data [calldata]

// You can specify the number of blobs uploaded in one transaction
eth-blob-uploader --rpc <rpc> --privateKey <private-key> --file <file-path> --to <to-address> --data [calldata] --count [count]

// You can also not specify specific parameters.
eth-blob-uploader <rpc> <private-key> <file-path> <to-address> --data [calldata] --count [count]

// output: send hash 
```

## Example
```
eth-blob-uploader -r http://65.109.115.36:8545/ -p 0xa... -f /User/a/b.jpg -t 0x13b...
eth-blob-uploader -r http://65.109.115.36:8545/ -p 0xa... -f /User/a/b.jpg -t 0x13b... -d 0xabc...
eth-blob-uploader -r http://65.109.115.36:8545/ -p 0xa... -f /User/a/b.jpg -t 0x13b... -c 4

eth-blob-uploader http://65.109.115.36:8545/ 0xa... /User/a/b.jpg 0x13b...
eth-blob-uploader http://65.109.115.36:8545/ 0xa... /User/a/b.jpg 0x13b... -d 0xxx... -c 6
```
<br/>

