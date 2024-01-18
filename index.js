const {BlobUploader, EncodeBlobs} = require("ethstorage-sdk");
const {ethers} = require("ethers");
const fs = require("fs");

const color = require('colors-cli/safe')
const error = color.red;
const notice = color.blue;
const MAX_BLOB_COUNT = 6;
const DEFAULT_COUNT = 3;

const flatDirectoryBlobAbi = [
  "function upfrontPayment() external view returns (uint256)"
];

async function getStorageCost(rpc, to) {
  const provider = new ethers.JsonRpcProvider(rpc);
  const fileContract = new ethers.Contract(to, flatDirectoryBlobAbi, provider);
  try {
    return await fileContract.upfrontPayment();
  } catch (e) {
    return 0n;
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

const uploadToAddress = async (rpc, privateKey, filePath, toAddress, data = "0x", count = DEFAULT_COUNT) => {
  console.log(notice(`rpc=${rpc}`));
  console.log(notice(`privateKey=${privateKey}`));
  console.log(notice(`filePath=${filePath}`));
  console.log(notice(`toAddress=${toAddress}`));
  console.log(notice(`calldata=${data}`));
  console.log(notice(`count=${count}\n`));

  if (!ethers.isHexString(data)) {
    console.log(error("Invalid data"));
    return;
  }

  let cost = 0n;
  if (await isContract(rpc, toAddress)) {
    if (data === "0x") {
      console.log(error("Contract calls must include the data parameter"));
      return;
    }
    // send ethStorage need pay
    cost = await getStorageCost(rpc, toAddress);
  }

  count = Number(count);
  if (count <= 0 || count > MAX_BLOB_COUNT) {
    count = DEFAULT_COUNT;
  }

  const content = fs.readFileSync(filePath);
  const blobs = EncodeBlobs(content);
  const blobLength = blobs.length;

  const uploader = new BlobUploader(rpc, privateKey);
  let currentIndex = 0;
  console.log("Start Send...")
  for (let i = 0; i < blobLength; i += count) {
    let max = i + count;
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
      value: cost * BigInt(blobs.length)
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
    console.log(error(`The remaining amount: ${blobLength - currentIndex}`));
  } else {
    console.log(notice(`File upload completed!!!`));
  }
}

module.exports.uploadToAddress = uploadToAddress;
