#!/usr/bin/env node
const {program} = require('commander');
program.version(require('./package.json').version);

const {uploadToAddress} = require("./index");

program
    .requiredOption('-r, --rpc <rpc>', 'provider url')
    .requiredOption('-p, --privateKey <privateKey>', 'private key')
    .requiredOption('-f, --file <file>', 'upload file path')
    .requiredOption('-t, --to <to>', 'to address')
    .option('-d, --data [data]', 'call data')
    .option('-v, --value [value]', 'The value sent in each transaction. \n' +
        'If there are multiple transactions for a file, the total amount is "value*txCount".')
    .option('-c, --count [count]', 'send blob count, max is 6')
    .option('-n, --nonce [nonce]', 'transaction nonce')
    .option('-g, --gasPrice [gasPrice]', 'transaction gas price')
    .option('-b, --blobPrice [blobPrice]', 'blob gas price')
    .parse(process.argv);

const opts = program.opts();
uploadToAddress(
    opts.rpc, opts.privateKey,
    opts.file, opts.to,
    opts.data, opts.value, opts.count,
    opts.nonce, opts.gasPrice, opts.blobPrice
);
