const {BlobUploader, EncodeBlobs, BLOB_DATA_SIZE} = require("ethstorage-sdk");
const {ethers} = require("ethers");
const fs = require("fs");

const color = require('colors-cli/safe')
const error = color.red;
const notice = color.blue;
const success = color.green;
const MAX_BLOB_COUNT = 6;
const DEFAULT_COUNT = 3;

async function getFileChunk(filePath, fileSize, start, end) {
  end = end > fileSize ? fileSize : end;
  const length = end - start;
  const buf = Buffer.alloc(length);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buf, 0, length, start);
  fs.closeSync(fd);
  return buf;
}

const uploadToAddress = async (
    rpc, privateKey, filePath, toAddress,
    data = "0x", value = 0n, count = DEFAULT_COUNT,
    nonce, gasPrice, blobPrice
) => {
  console.log("\n");
  console.log(notice(`RPC: ${rpc}`));
  console.log(notice(`Private Key: ${privateKey}`));
  console.log(notice(`File Path: ${filePath}`));
  console.log(notice(`To Address: ${toAddress}`));
  console.log(notice(`CallData: ${data}`));
  console.log(notice(`Value: ${value}`));
  console.log(notice(`Blob count per transaction: ${count}`));
  console.log("\n");

  count = Number(count);
  if (count <= 0 || count > MAX_BLOB_COUNT) {
    console.log(error("Invalid Blob Count!"));
    return;
  }
  if (!ethers.isHexString(data)) {
    console.log(error("Invalid CallData!"));
    return;
  }
  if (!fs.existsSync(filePath)) {
    console.log(error("Invalid File!"));
    return;
  }
  const fileStat = fs.statSync(filePath);
  if (!fileStat.isFile()) {
    console.log(error("Invalid File!"));
    return;
  }

  const fileSize = fileStat.size;
  const blobDataSize = BLOB_DATA_SIZE;
  const blobLength = Math.ceil(fileSize / blobDataSize);

  const uploader = new BlobUploader(rpc, privateKey);
  let currentIndex = 0;
  console.log("Start Send...")
  for (let i = 0; i < blobLength; i += count) {
    const content = await getFileChunk(filePath, fileSize, i * blobDataSize, (i + count) * blobDataSize);
    const blobs = EncodeBlobs(content);
    const indexArr = [];
    for (let j = 0; j < blobs.length; j++) {
      indexArr.push(i + j);
    }

    const tx = {
      nonce: nonce ? BigInt(nonce) : undefined,
      to: toAddress,
      data: data,
      value: BigInt(value),
      maxFeePerGas: gasPrice,
      maxPriorityFeePerGas: gasPrice,
      maxFeePerBlobGas: blobPrice,
    };
    let isSuccess = false;
    try {
      const txRes = await uploader.sendTx(tx, blobs);
      console.log("Tx hash:", txRes.hash);
      const txReceipt = await uploader.getTxReceipt(txRes.hash);
      if (txReceipt && txReceipt.status) {
        isSuccess = true;
        currentIndex += indexArr.length;
        console.log(`Blob index: ${indexArr} uploaded!`);
      }
    } catch (e) {
      const length = e.message.length;
      console.log(length > 210 ? (e.message.substring(0, 100) + " ... " + e.message.substring(length - 100, length)) : e.message);
      console.log(error(`Upload ${filePath} fail!`));
    }
    if (!isSuccess) {
      break;
    }
  }

  console.log(notice("Total number of blobs:"), success(`${blobLength}`));
  console.log(notice("Number of blobs uploaded this time:"), success(`${currentIndex}`));
  if (blobLength > currentIndex) {
    console.log(error(`Number of remaining blobs: ${blobLength - currentIndex}`));
  } else {
    console.log(notice(`File upload completed!!!`));
  }
}

module.exports.uploadToAddress = uploadToAddress;
