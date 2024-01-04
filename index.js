const {BlobUploader, EthStorage, EncodeBlobs, BLOB_FILE_SIZE} = require("ethstorage-sdk");
const {ethers} = require("ethers");
const {v4: uuidv4} = require('uuid');
const fs = require("fs");

const color = require('colors-cli/safe')
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
    return false;
  }
}

async function isContract(rpc, to) {
  const provider = new ethers.JsonRpcProvider(rpc);
  try {
    const code = await provider.getCode(to);
    return code.length > 5;
  } catch (e) {
    return false;
  }
}

const uploadToAddress = async (rpc, privateKey, filePath, toAddress, data) => {
  if (await isContract(rpc, toAddress)) {
    if (!data) {
      console.log(error("Contract calls must include the data parameter"));
      return;
    } else if (!ethers.isHexString(data)) {
      console.log(error("Invalid data"));
      return;
    }
  }

  data = data ?? "0x";
  const uploader = new BlobUploader(rpc, privateKey);
  const content = fs.readFileSync(filePath);
  const blobs = EncodeBlobs(content);
  const blobLength = blobs.length;
  let currentIndex = 0;
  console.log("\nStart Send...")
  for (let i = 0; i < blobLength; i += MAX_BLOB_COUNT) {
    let max = i + MAX_BLOB_COUNT;
    if (max > blobLength) {
      max = blobLength;
    }
    const indexArr = [];
    const blobArr = [];
    for (let j = i; j < max; j++) {
      indexArr.push(j);
      blobArr.push(blobs[j]);
    }

    const tx = {
      to: toAddress,
      data: data,
    };
    let isSuccess = true;
    try {
      const hash = await uploader.sendTx(tx, blobArr);
      console.log("Tx hash:", hash);
      const txReceipt = await uploader.getTxReceipt(hash);
      if (txReceipt.status) {
        currentIndex += blobArr.length;
        console.log(`Blob index: ${indexArr} uploaded!`);
      } else {
        isSuccess = false;
      }
    } catch (e) {
      isSuccess = false;
    }

    if (!isSuccess) {
      break;
    }
  }

  console.log(notice("Total number of blobs:"), error(`${blobLength}`));
  console.log(notice("Quantity uploaded this time:"), error(`${currentIndex}`));
  if (blobLength > currentIndex) {
    console.log(notice("The remaining amount:"), error(`${blobLength - currentIndex}`));
  } else {
    console.log(notice(`File upload completed!!!`));
  }
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
  let currentIndex = 0;
  for (let i = 0; i < blobLength; i++) {
    const key = ethers.keccak256(ethers.toUtf8Bytes(uuidv4()));
    let chunkSize = BLOB_FILE_SIZE;
    if (i === blobLength - 1) {
      chunkSize = fileSize - BLOB_FILE_SIZE * (blobLength - 1);
    }

    // send
    let isSuccess = true;
    try {
      const tx = await fileContract.putBlob.populateTransaction(key, 0, chunkSize, {
        value: cost
      });
      const hash = await uploader.sendTx(tx, [blobs[i]]);
      console.log(`Transaction Id: ${hash}`);
      const txReceipt = await uploader.getTxReceipt(hash);
      if (txReceipt.status) {
        currentIndex++;
        console.log(`Blob Send Success: blob key=${key}`);
      } else {
        console.log(error(`Blob Send Fail: ${i}`));
        isSuccess = false;
      }
    } catch (e) {
      isSuccess = false;
    }
    if (!isSuccess) {
      break;
    }
  }

  console.log(notice("Total number of blobs:"), error(`${blobLength}`));
  console.log(notice("Quantity uploaded this time:"), error(`${currentIndex}`));
  if (blobLength > currentIndex) {
    console.log(notice("The remaining amount:"), error(`${blobLength - currentIndex}`));
  } else {
    console.log(notice(`File upload completed!!!`));
  }
}

const uploadToFlatDirectory = async (rpc, privateKey, filePath, toAddress) => {
  const ethStorage = new EthStorage(rpc, privateKey, toAddress ?? null);
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
  if (result) {
    console.log(notice("Total number of blobs:"), error(`${result.totalBlobCount}`));
    console.log(notice("Quantity uploaded this time:"), error(`${result.uploadCount}`));
    if (result.totalBlobCount > result.successBlobIndex) {
      console.log(notice("The remaining amount:"), error(`${result.totalBlobCount - result.successBlobIndex}`));
    } else {
      console.log(notice(`Upload completed!!!`));
    }
  }
}
// **** function ****


module.exports.uploadToAddress = uploadToAddress;
module.exports.uploadToEthStorage = uploadToEthStorage;
module.exports.uploadToFlatDirectory = uploadToFlatDirectory;
