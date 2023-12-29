const {BlobUploader, EthStorage, EncodeBlobs} = require("ethstorage-sdk");
const {ethers} = require("ethers");
const {v4: uuidv4} = require('uuid');
const fs = require("fs");

const color = require('colors-cli/safe')
const {BLOB_FILE_SIZE} = require("ethstorage-sdk/src/blobs");
const error = color.red;
const notice = color.blue;

const MAX_BLOB_COUNT = 3;
const ETH_STORAGE = "0xb4B46bdAA835F8E4b4d8e208B6559cD267851051";

const flatDirectoryBlobAbi = [
  "function upfrontPayment() external view returns (uint256)",
  "function putBlob(bytes32 key, uint256 blobIdx, uint256 length) external payable",
  "function hash(bytes32 key) external view returns (bytes24)",
  "function upfrontPayment() external view returns (uint256)"
];

async function isFlatContract(rpc, to) {
  const provider = new ethers.JsonRpcProvider(rpc);
  const fileContract = new ethers.Contract(to, flatDirectoryBlobAbi, provider);
  try {
    await fileContract.upfrontPayment();
    return true;
  } catch (e) {
    console.log(e)
    return false;
  }
}

const uploadToAddress = async (rpc, privateKey, toAddress, filePath, data) => {
  data = data ?? "0x"
  if (!ethers.isHexString(data)) {
    console.log(error("Invalid data"));
    return;
  }

  const uploader = new BlobUploader(rpc, privateKey);
  const content = fs.readFileSync(filePath);
  const blobs = EncodeBlobs(content);
  const blobLength = blobs.length;
  console.log("\nStart Send...")
  for (let i = 0; i < blobLength; i += MAX_BLOB_COUNT) {
    let max = i + MAX_BLOB_COUNT;
    if (max > blobLength) {
      max = blobLength;
    }

    let blobArr = [];
    for (let j = i; j < max; j++) {
      blobArr.push(blobs[j]);
    }

    const tx = {
      to: toAddress,
      data: data,
      gasLimit:  21000n,
    };
    const hash = await uploader.sendTx(tx, blobArr);
    console.log("Tx hash:", hash);
    const txReceipt = await uploader.getTxReceipt(hash);
    if (txReceipt.status) {
      console.log(`Blob Send Success: (${i} , ${max - 1}]`);
    } else {
      console.log(error(`Blob Send Fail: (${i} , ${max - 1}]`));
      break;
    }
  }
  console.log(notice(`Total Blob Count: ${blobLength}`));
}

const uploadToEthStorage = async (rpc, privateKey, filePath) => {
  const fileStat = fs.statSync(filePath);
  if (!fileStat.isFile()) {
    console.error(`ERROR: only upload file!`);
    return;
  }

  const uploader = new BlobUploader(rpc, privateKey);
  console.log("\nStart Send To EthStorage!")

  const provider = new ethers.JsonRpcProvider(rpc);
  const fileContract = new ethers.Contract(ETH_STORAGE, flatDirectoryBlobAbi, provider);
  const cost = await fileContract.upfrontPayment();

  const content = fs.readFileSync(filePath);
  const blobs = EncodeBlobs(content);
  const blobLength = blobs.length;
  const fileSize = fileStat.size;
  for (let i = 0; i < blobLength; i++) {
    const key = ethers.keccak256(ethers.toUtf8Bytes(uuidv4()));
    let chunkSize = BLOB_FILE_SIZE;
    if (i === blobLength - 1) {
      chunkSize = fileSize - BLOB_FILE_SIZE * (blobLength - 1);
    }

    // send
    const tx = await fileContract.putBlob.populateTransaction(key, 0, chunkSize, {
      value: cost
    });
    const hash = await uploader.sendTx(tx, [blobs[i]]);
    console.log(`Transaction Id: ${hash}`);
    const txReceipt = await uploader.getTxReceipt(hash);
    if (txReceipt.status) {
      console.log(`Blob Send Success: index=${i}, key=${key}`);
    } else {
      console.log(error(`Blob Send Fail: ${i}`));
      break;
    }
  }
  console.log(notice(`Total Blob Count: ${blobLength}`));
}

const uploadToFlatDirectory = async (rpc, privateKey, toAddress, filePath) => {
  const ethStorage = new EthStorage(rpc, privateKey, toAddress??null);
  console.log("\nStart Send To FlatDirectory!")

  if (!toAddress) {
    await ethStorage.deployDirectory();
  } else {
    const success = await isFlatContract(rpc, toAddress);
    if (!success) {
      console.error(error("Invalid FlatDirectory Address!"));
      return;
    }
  }

  const result = await ethStorage.upload(filePath);
  console.log(notice(`Total Blob Count: ${result.totalBlobCount}`));
}
// **** function ****


module.exports.uploadToAddress = uploadToAddress;
module.exports.uploadToEthStorage = uploadToEthStorage;
module.exports.uploadToFlatDirectory = uploadToFlatDirectory;
